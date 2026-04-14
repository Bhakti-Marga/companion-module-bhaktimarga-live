import type { BhaktiMargaLiveInstance } from './main.js'
import type { ActionResponse } from './api.js'

/** State → optimistic next state label after a successful action */
const NEXT_STATE: Record<string, string> = {
	publish: 'PUBLISHED',
	'starting-soon': 'STARTING SOON',
	'go-live': 'LIVE',
	'end-live': 'VOD IN PROGRESS',
}

export function UpdateActions(self: BhaktiMargaLiveInstance): void {
	self.setActionDefinitions({
		advance_live: {
			name: 'Advance Live State',
			description:
				'Short press advances through Publish → Starting Soon → Go Live. ' +
				'Does nothing while live (use end_live for that).',
			options: [],
			callback: async () => {
				const next = self.currentLive?.nextAction
				if (!next || next === 'end-live') {
					// End-live requires long press — short press is a no-op
					self.log('debug', 'Short press ignored: state requires long press or no action available')
					return
				}
				await executeAction(self, next)
			},
		},

		end_live: {
			name: 'End Live (long press)',
			description: 'Ends the live broadcast. Wire this to a long-press preset.',
			options: [],
			callback: async () => {
				if (self.currentLive?.nextAction !== 'end-live') {
					self.log('debug', 'end_live ignored: not currently live')
					return
				}
				await executeAction(self, 'end-live')
			},
		},
	})
}

async function executeAction(self: BhaktiMargaLiveInstance, action: string): Promise<void> {
	try {
		const res = await self.apiFetch('POST', `/streamdeck/${action}`)
		if (res.ok) {
			const data = (await res.json()) as ActionResponse
			self.log('info', `${action}: ${data.state} — ${data.title}`)
			self.applyOptimisticState(NEXT_STATE[action] ?? data.state)
		} else {
			// 409 or 404 — next poll will correct the button state
			self.log('warn', `${action} rejected: HTTP ${res.status}`)
		}
	} catch (err) {
		self.log('error', `${action} failed: ${err}`)
	}
}
