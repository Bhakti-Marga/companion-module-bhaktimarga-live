import { combineRgb } from '@companion-module/base'
import type { BhaktiMargaLiveInstance } from './main.js'

const GREY = combineRgb(80, 80, 80)
const DARK_GREY = combineRgb(40, 40, 40)
const AMBER: [number, number, number] = [220, 160, 0]
const RED: [number, number, number] = [200, 0, 0]
const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)

/** Linearly interpolate between two RGB colors. t=0 → a, t=1 → b */
function lerpRgb(a: [number, number, number], b: [number, number, number], t: number): number {
	return combineRgb(
		Math.round(a[0] + (b[0] - a[0]) * t),
		Math.round(a[1] + (b[1] - a[1]) * t),
		Math.round(a[2] + (b[2] - a[2]) * t),
	)
}

interface StateAppearance {
	/** Action button: what pressing the button does */
	action: string
	/** Status button: current state label */
	status: string
	/** Action button background — bright/saturated */
	actionBg: number
	/** Status button background — dimmed ~50% */
	statusBg: number
	color: number
}

const STATE_APPEARANCE: Record<string, StateAppearance> = {
	'DRAFT':           { action: 'PUBLISH',         status: 'DRAFT',          actionBg: combineRgb(0, 100, 200), statusBg: combineRgb(0, 50, 100),   color: WHITE },
	'PUBLISHED':       { action: 'PREVIEW',  status: 'PUBLISHED',      actionBg: combineRgb(0, 160, 0),   statusBg: combineRgb(0, 80, 0),     color: WHITE },
	'STARTING SOON':   { action: 'GO LIVE',         status: 'PREVIEW',        actionBg: combineRgb(...AMBER),    statusBg: combineRgb(110, 80, 0),   color: WHITE },
	'LIVE':            { action: 'HOLD TO\nEND',    status: 'LIVE',           actionBg: combineRgb(...RED),      statusBg: combineRgb(100, 0, 0),    color: WHITE },
	'VOD IN PROGRESS': { action: 'VOD\nPROCESSING', status: 'Set VOD\nin Manager', actionBg: GREY,           statusBg: DARK_GREY,                 color: WHITE },
	'VOD READY':       { action: 'VOD\nREADY',      status: 'VOD available\non Bhakti+',  actionBg: GREY,           statusBg: DARK_GREY,                 color: WHITE },
}

const NO_LIVE: StateAppearance = { action: 'NO LIVE', status: 'IDLE', actionBg: GREY, statusBg: DARK_GREY, color: WHITE }

export function getStateAppearance(state: string | undefined): StateAppearance {
	if (!state) return NO_LIVE
	return STATE_APPEARANCE[state] ?? NO_LIVE
}

export function UpdateFeedbacks(self: BhaktiMargaLiveInstance): void {
	self.setFeedbackDefinitions({
		live_button_state: {
			name: 'Live Action Button',
			type: 'advanced',
			description: 'Shows the next action (what pressing the button will do)',
			options: [],
			callback: () => {
				const appearance = getStateAppearance(self.currentLive?.state)
				let bgcolor = appearance.actionBg

				// Smooth pulse amber↔red when GO LIVE is available
				if (self.currentLive?.state === 'STARTING SOON') {
					bgcolor = lerpRgb(AMBER, RED, self.pulsePhase)
				}

				return {
					text: appearance.action,
					bgcolor,
					color: appearance.color,
				}
			},
		},
		live_status: {
			name: 'Live Status Display',
			type: 'advanced',
			description: 'Shows the current state of the live broadcast with title and duration',
			options: [],
			callback: () => {
				const live = self.currentLive
				const appearance = getStateAppearance(live?.state)
				const parts = [appearance.status]
				if (live?.title) parts.push(live.title)
				if (live?.isLiveNow && live.startDateLive) {
					const elapsedSec = Math.max(0, Math.floor((Date.now() - new Date(live.startDateLive).getTime()) / 1000))
					const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0')
					const ss = String(elapsedSec % 60).padStart(2, '0')
					parts.push(`${mm}:${ss}`)
				}
				return {
					text: parts.join('\\n'),
					bgcolor: appearance.statusBg,
					color: appearance.color,
				}
			},
		},
	})
}
