import {
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	type SomeCompanionConfigField,
} from '@companion-module/base'
import { GetConfigFields, type ModuleConfig, type ModuleSecrets } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { UpdateVariableDefinitions } from './variables.js'
import type { StatusResponse, CurrentLive } from './api.js'

export class BhaktiMargaLiveInstance extends InstanceBase<ModuleConfig, ModuleSecrets> {
	config!: ModuleConfig
	secrets!: ModuleSecrets

	/** Latest polled state — null means no current live selected */
	currentLive: CurrentLive | null = null

	private pollTimer: ReturnType<typeof setInterval> | null = null
	private pulseTimer: ReturnType<typeof setInterval> | null = null

	/** 0–1 sine wave phase for the GO LIVE pulse animation */
	pulsePhase = 0
	private pulseStart = 0

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig, _isFirstInit: boolean, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()

		if (!this.config.apiUrl || !this.secrets.apiKey) {
			this.updateStatus(InstanceStatus.BadConfig, 'API URL and API Key must be set')
			return
		}

		this.updateStatus(InstanceStatus.Connecting)
		this.startPolling()
	}

	async destroy(): Promise<void> {
		this.stopPolling()
		this.stopPulse()
	}

	async configUpdated(config: ModuleConfig, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets
		this.stopPolling()

		if (!this.config.apiUrl || !this.secrets.apiKey) {
			this.updateStatus(InstanceStatus.BadConfig, 'API URL and API Key must be set')
			return
		}

		this.updateStatus(InstanceStatus.Connecting)
		this.startPolling()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	// ── Polling ──────────────────────────────────────────────────────

	private startPolling(): void {
		if (!this.config.apiUrl) return

		// Poll immediately, then on interval
		void this.pollStatus()
		this.pollTimer = setInterval(() => {
			void this.pollStatus()
		}, this.config.pollInterval || 2000)
	}

	private stopPolling(): void {
		if (this.pollTimer !== null) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}
	}

	// ── Pulse animation ──────────────────────────────────────────────

	private startPulse(): void {
		if (this.pulseTimer) return
		this.pulseStart = Date.now()
		this.pulseTimer = setInterval(() => {
			// 1.5s full cycle, smooth sine wave 0→1→0
			const elapsed = (Date.now() - this.pulseStart) / 1500
			this.pulsePhase = (Math.sin(elapsed * 2 * Math.PI) + 1) / 2
			this.checkFeedbacks('live_button_state')
		}, 60)
	}

	private stopPulse(): void {
		if (this.pulseTimer) {
			clearInterval(this.pulseTimer)
			this.pulseTimer = null
			this.pulsePhase = 0
		}
	}

	async pollStatus(): Promise<void> {
		try {
			const res = await this.apiFetch('GET', '/streamdeck/status')
			const data = (await res.json()) as StatusResponse
			this.currentLive = data.currentLive
			this.updateStatus(InstanceStatus.Ok)
		} catch (err) {
			this.log('error', `Poll failed: ${err}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, String(err))
			this.currentLive = null
		}

		this.refreshState()
	}

	// ── API helper ───────────────────────────────────────────────────

	async apiFetch(method: string, path: string): Promise<Response> {
		const url = `${this.config.apiUrl.replace(/\/+$/, '')}${path}`
		const res = await fetch(url, {
			method,
			headers: { 'x-api-key': this.secrets.apiKey ?? '' },
			signal: AbortSignal.timeout(5000),
		})
		if (!res.ok && res.status !== 409 && res.status !== 404) {
			throw new Error(`HTTP ${res.status}`)
		}
		return res
	}

	// ── State refresh ────────────────────────────────────────────────

	refreshState(): void {
		const live = this.currentLive
		const elapsed = this.computeElapsed(live)

		this.setVariableValues({
			live_title: live?.title ?? 'No Live Selected',
			live_state: live?.state ?? 'NO LIVE SELECTED',
			live_duration: elapsed,
		})
		// Pulse the GO LIVE button when in preview/starting-soon state
		if (live?.state === 'STARTING SOON') {
			this.startPulse()
		} else {
			this.stopPulse()
		}

		this.checkFeedbacks('live_button_state', 'live_status')
	}

	/** Applies optimistic state after a successful action, before next poll confirms */
	applyOptimisticState(newState: string): void {
		if (this.currentLive) {
			this.currentLive = { ...this.currentLive, state: newState }

			// Derive nextAction from optimistic state
			const nextMap: Record<string, string | null> = {
				'PUBLISHED': 'starting-soon',
				'STARTING SOON': 'go-live',
				'LIVE': 'end-live',
				'VOD IN PROGRESS': null,
			}
			this.currentLive.nextAction = nextMap[newState] ?? null

			if (newState === 'LIVE') this.currentLive.isLiveNow = true
			if (newState === 'VOD IN PROGRESS') this.currentLive.isLiveNow = false
		}
		this.refreshState()
	}

	private computeElapsed(live: CurrentLive | null): string {
		if (!live?.isLiveNow || !live.startDateLive) return ''

		const startMs = new Date(live.startDateLive).getTime()
		const elapsedSec = Math.max(0, Math.floor((Date.now() - startMs) / 1000))
		const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0')
		const ss = String(elapsedSec % 60).padStart(2, '0')
		return `${mm}:${ss}`
	}

	// ── Wiring ───────────────────────────────────────────────────────

	updateActions(): void {
		UpdateActions(this)
	}
	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}
	updatePresets(): void {
		UpdatePresets(this)
	}
	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(BhaktiMargaLiveInstance, UpgradeScripts)
