import { combineRgb, type CompanionPresetDefinitions } from '@companion-module/base'
import type { BhaktiMargaLiveInstance } from './main.js'

const GREY = combineRgb(80, 80, 80)
const WHITE = combineRgb(255, 255, 255)

export function UpdatePresets(self: BhaktiMargaLiveInstance): void {
	const presets: CompanionPresetDefinitions = {}

	// Main action button — short press advances, long press (2s) ends live
	presets['live_control'] = {
		type: 'button',
		category: 'Live Control',
		name: 'Advance / End Live',
		style: {
			text: 'NO LIVE\nSELECTED',
			size: 'auto',
			color: WHITE,
			bgcolor: GREY,
			show_topbar: false,
		},
		steps: [
			{
				down: [],
				up: [{ actionId: 'advance_live', options: {} }],
				2000: {
					actions: [{ actionId: 'end_live', options: {} }],
					options: { runWhileHeld: false },
				},
			},
		],
		feedbacks: [
			{
				feedbackId: 'live_button_state',
				options: {},
			},
		],
	}

	// Status display button — shows current state with color (no action)
	presets['live_status'] = {
		type: 'button',
		category: 'Live Control',
		name: 'Live Status Display',
		style: {
			text: 'NO LIVE\nSELECTED',
			size: 'auto',
			color: WHITE,
			bgcolor: GREY,
			show_topbar: false,
		},
		steps: [{ down: [], up: [] }],
		feedbacks: [
			{
				feedbackId: 'live_status',
				options: {},
			},
		],
	}

	self.setPresetDefinitions(presets)
}
