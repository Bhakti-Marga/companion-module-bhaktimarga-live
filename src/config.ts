import type { SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	apiUrl: string
	pollInterval: number
}

export interface ModuleSecrets {
	apiKey: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'apiUrl',
			label: 'API Base URL',
			width: 8,
			default: 'https://media-api.bhaktimarga.org',
			tooltip: 'Base URL of the BM MediaPlatform API (no trailing slash)',
		},
		{
			type: 'secret-text',
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
