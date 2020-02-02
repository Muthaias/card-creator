import { CrudContext } from '../ItemCrud'
import { ImageDescriptor, CardDescriptor, CardCondition, ActionData, NamedIdentity, EventDescriptor, CardType } from '../Types'
import * as SFF from '../SFFTypes';

export const exportGameWorld = ({
    cards,
    images,
    events,
}: {
    cards: CrudContext<CardDescriptor>;
    images: CrudContext<ImageDescriptor>;
    events: CrudContext<EventDescriptor>;
}) => {
    const cardItems = cards.items();
    const eventItems = events.items();

    const actionCards = cardItems.filter(card => (
        card.type !== CardType.Event
    )).map(card => exportActionCard({card, images})).reduce((acc, actionCardGroup) => acc.concat(actionCardGroup), []);
    const eventCards = cardItems.filter(card => (
        card.type === CardType.Event
    )).map(card => exportEventCard({card, images})).reduce<{[x: string]: SFF.EventCard}>((cardMap, card) => {cardMap[card.id] = card; return cardMap}, {});
    const eventData = eventItems.map(event => exportEvent({event})).reduce((acc, eventCardGroup) => acc.concat(eventCardGroup), []);

    const worldData = {
        cards: actionCards,
        events: eventData,
        eventCards: eventCards,
    }
    return worldData;
}

const defaultWorldQuery = (): SFF.WorldQuery => {
    return {
        state: {
            environment: [0, 100],
            people: [0, 100],
            money: [0, 100],
            security: [0, 100]
        }
    }
}

const exportActionCard = ({
    card,
    images
}: {
    card: CardDescriptor,
    images: CrudContext<ImageDescriptor>
}): SFF.CardData[] => {
    const description = exportCardDescription({card, images});

    const [leftAction, rightAction] = getActions(card);
    
    return [
        Object.assign({}, description, {
            id: card.id,
            type: 'card' as 'card',
            weight: card.weight,
            isAvailableWhen: card.conditions.length > 0 ? card.conditions.map(exportCondition) : [
                defaultWorldQuery()
            ],
            actions: {
                left: leftAction ? exportAction(leftAction) : defaultAction,
                right: rightAction ? exportAction(rightAction) : defaultAction,
            }
        })
    ]
}

const exportEventCard = ({
    card,
    images
}: {
    card: CardDescriptor,
    images: CrudContext<ImageDescriptor>
}): SFF.EventCard => {
    const description = exportCardDescription({card, images});

    const [leftAction, rightAction] = getActions(card);
    
    return Object.assign(description, {
        type: 'event' as 'event',
        actions: {
            left: leftAction ? exportEventAction(leftAction) : defaultAction,
            right: rightAction ? exportEventAction(rightAction) : defaultAction,
        }
    });
}

export const exportCardDescription = ({
    card,
    images,
}: {
    card: CardDescriptor,
    images?: CrudContext<ImageDescriptor>,
}): SFF.CardDescription => {
    const image: ImageDescriptor =  images && images.get({id: card.imageId || ''}) || {
        id: '',
        name: '',
        src: '',
        tags: [],
    };

    return {
        id: card.id,
        image: image.src,
        title: card.name,
        text: card.text,
        weight: 1,
        distance: card.location,
    };
}

const exportCondition = (condition: CardCondition): SFF.WorldQuery => {
    const defaultState: SFF.WorldQuery['state'] = {
        environment: [0, 100],
        people: [0, 100],
        security: [0, 100],
        money: [0, 100]
    };
    const worldQuery: SFF.WorldQuery = {
        state: Object.assign(defaultState, condition.values),
        flags: condition.flags
    }

    return worldQuery
}

const getActions = (card: CardDescriptor): [ActionData | undefined, ActionData | undefined] => {
    const leftAction = card.actions.find((action) => action.actionId.toLowerCase() === 'left');
    const rightAction = card.actions.find((action) => action.actionId.toLowerCase() === 'right');
    return [leftAction, rightAction];
}

const exportAction = (action: ActionData): SFF.CardActionData => {
    return {
        description: action.description,
        modifier: {
            type: action.modifierType,
            state: action.values,
            flags: Object.assign({}, action.flags)
        }
    }
}

const exportEventAction = (action: ActionData): SFF.EventCardActionData => {
    const actionData: SFF.EventCardActionData = exportAction(action);
    actionData.nextEventCardId = action.nextCardId;
    return actionData;
}

const exportEvent = ({
    event,
}: {
    event: EventDescriptor,
}): SFF.WorldEvent[] => {
    return event.initialCardId === undefined ? [] : [{
        probability: event.weight,
        shouldTriggerWhen: event.conditions.length > 0 ? event.conditions.map(exportCondition) : [
            defaultWorldQuery()
        ],
        initialEventCardId: event.initialCardId,
    }];
}


const defaultAction: SFF.CardActionData = {
    modifier: {}
};
