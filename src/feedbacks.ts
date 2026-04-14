import { combineRgb } from '@companion-module/base'
import type { BhaktiMargaLiveInstance } from './main.js'

const GREY = combineRgb(80, 80, 80)
const BLUE = combineRgb(0, 100, 200)
const AMBER = combineRgb(220, 160, 0)
const GREEN = combineRgb(0, 160, 0)
const RED = combineRgb(200, 0, 0)
const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)

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
	'STARTING SOON': { action: 'GO LIVE', status: 'PREVIEW', bgcolor: AMBER, color: BLACK },
	'LIVE': { action: 'HOLD TO\nEND', status: 'LIVE', bgcolor: RED, color: WHITE },
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
				return {
					text: appearance.action,
					bgcolor: appearance.bgcolor,
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
