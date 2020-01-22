type WorldState = {}

interface CardDescription {
    image: string
    title: string
    text: string
    weight: number
    distance: string
}

export interface GameWorldModifier {
    type?: 'add' | 'set' | 'replace'
    state?: {
        environment?: number
        people?: number
        security?: number
        money?: number
    }
    flags?: {
        [x: string]: boolean
    }
}

export interface CardActionData {
    description?: string
    modifier: GameWorldModifier
}

export interface CardData extends CardDescription {
    type: "card",
    isAvailableWhen: WorldQuery[]
    actions: {
        left: CardActionData
        right: CardActionData
    }
}

type WorldStateRange = [number, number]


export interface WorldQuery {
    state?: {
        environment: WorldStateRange
        people: WorldStateRange
        security: WorldStateRange
        money: WorldStateRange
        [x: string]: WorldStateRange
    }
    flags?: {
        [x: string]: boolean
    }
}

// -----------------------------

export interface WorldEvent {
    probability: number
    shouldTriggerWhen?: WorldQuery[]
    initialEventCardId: EventCardId
}

export type EventCards = {
    [eventCardId: string]: EventCard
}

export interface EventCard extends CardDescription {
    type: "event",
    actions: {
        left: EventCardActionData
        right: EventCardActionData
    }
}

type EventCardId = string

export interface EventCardActionData extends CardActionData {
    nextEventCardId?: EventCardId
}
