import type { BhaktiMargaLiveInstance } from './main.js'

export function UpdateVariableDefinitions(self: BhaktiMargaLiveInstance): void {
	self.setVariableDefinitions([
		{ variableId: 'live_title', name: 'Current Live Title' },
		{ variableId: 'live_state', name: 'Current Operational State' },
		{ variableId: 'live_duration', name: 'Elapsed Time (mm:ss)' },
	])
}
