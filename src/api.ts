/** Shape of GET /streamdeck/status response */
export interface StatusResponse {
	currentLive: CurrentLive | null
}

export interface CurrentLive {
	id: number
	title: string
	state: string
	nextAction: string | null
	isLiveNow: boolean
	startDateLive: string | null
	endDateLive: string | null
}

/** Shape of POST /streamdeck/* success response */
export interface ActionResponse {
	success: boolean
	state: string
	title: string
}

/** Shape of POST /streamdeck/* error response */
export interface ErrorResponse {
	error: string
	message: string
	currentState?: string
}

/** Known live states from the API */
export type LiveState =
	| 'DRAFT'
	| 'PUBLISHED'
	| 'STARTING SOON'
	| 'LIVE'
	| 'VOD IN PROGRESS'
	| 'VOD READY'

/** The action slug returned by nextAction */
export type NextAction = 'publish' | 'starting-soon' | 'go-live' | 'end-live'
