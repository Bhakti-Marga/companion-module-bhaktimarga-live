import type { SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	apiUrl: string
	apiKey: string
	pollInterval: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'apiUrl',
			label: 'API Base URL',
			width: 8,
			default: 'https://api.bhaktiplus.com',
			tooltip: 'Base URL of the BM MediaPlatform API (no trailing slash)',
		},
		{
			type: 'textinput',
			id: 'apiKey',
			label: 'Admin API Key',
			width: 8,
		},
		{
			type: 'number',
			id: 'pollInterval',
			label: 'Poll Interval (ms)',
			width: 4,
			min: 500,
			max: 10000,
			default: 2000,
		},
	]
}
