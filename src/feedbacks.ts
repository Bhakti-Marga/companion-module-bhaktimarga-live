import { combineRgb } from '@companion-module/base'
import type { BhaktiMargaLiveInstance } from './main.js'

const GREY = combineRgb(80, 80, 80)
const BLUE = combineRgb(0, 100, 200)
const AMBER: [number, number, number] = [220, 160, 0]
const GREEN = combineRgb(0, 160, 0)
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
	bgcolor: number
	color: number
}

const STATE_APPEARANCE: Record<string, StateAppearance> = {
	'DRAFT': { action: 'PUBLISH', status: 'DRAFT', bgcolor: BLUE, color: WHITE },
	'PUBLISHED': { action: 'START\nPREVIEW', status: 'PUBLISHED', bgcolor: GREEN, color: BLACK },
	'STARTING SOON': { action: 'GO LIVE', status: 'PREVIEW', bgcolor: combineRgb(...AMBER), color: BLACK },
	'LIVE': { action: 'HOLD TO\nEND', status: 'LIVE', bgcolor: combineRgb(...RED), color: WHITE },
	'VOD IN PROGRESS': { action: 'VOD\nPROCESSING', status: 'VOD\nPROCESSING', bgcolor: GREY, color: WHITE },
	'VOD READY': { action: 'VOD\nREADY', status: 'VOD\nREADY', bgcolor: GREY, color: WHITE },
}

const NO_LIVE: StateAppearance = { action: 'NO LIVE\nSELECTED', status: 'NO LIVE\nSELECTED', bgcolor: GREY, color: WHITE }

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
				let bgcolor = appearance.bgcolor

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
			description: 'Shows the current state of the live broadcast',
			options: [],
			callback: () => {
				const appearance = getStateAppearance(self.currentLive?.state)
				return {
					text: appearance.status,
					bgcolor: appearance.bgcolor,
					color: appearance.color,
				}
			},
		},
	})
}
