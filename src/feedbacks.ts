import { combineRgb } from '@companion-module/base'
import type { BhaktiMargaLiveInstance } from './main.js'

const GREY = combineRgb(80, 80, 80)
const BLUE = combineRgb(0, 100, 200)
const GREEN = combineRgb(0, 160, 0)
const RED = combineRgb(200, 0, 0)
const AMBER = combineRgb(220, 160, 0)
const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)

interface StateAppearance {
	text: string
	bgcolor: number
	color: number
}

const STATE_APPEARANCE: Record<string, StateAppearance> = {
	'DRAFT': { text: 'PUBLISH', bgcolor: BLUE, color: WHITE },
	'PUBLISHED': { text: 'STARTING\nSOON', bgcolor: GREEN, color: BLACK },
	'STARTING SOON': { text: 'GO LIVE', bgcolor: GREEN, color: BLACK },
	'LIVE': { text: 'HOLD TO\nEND', bgcolor: RED, color: WHITE },
	'VOD IN PROGRESS': { text: 'VOD\nENDED', bgcolor: AMBER, color: BLACK },
	'VOD READY': { text: 'VOD\nREADY', bgcolor: AMBER, color: BLACK },
}

const NO_LIVE: StateAppearance = { text: 'NO LIVE\nSELECTED', bgcolor: GREY, color: WHITE }

export function getStateAppearance(state: string | undefined): StateAppearance {
	if (!state) return NO_LIVE
	return STATE_APPEARANCE[state] ?? NO_LIVE
}

export function UpdateFeedbacks(self: BhaktiMargaLiveInstance): void {
	self.setFeedbackDefinitions({
		live_button_state: {
			name: 'Live Button State',
			type: 'advanced',
			description: 'Updates button appearance based on the current live state',
			options: [],
			callback: () => {
				const appearance = getStateAppearance(self.currentLive?.state)
				return {
					text: appearance.text,
					bgcolor: appearance.bgcolor,
					color: appearance.color,
				}
			},
		},
	})
}
