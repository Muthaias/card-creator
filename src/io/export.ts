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
    const eventData = eventItems.map(event => exportEvent({event, cards})).reduce((acc, eventCardGroup) => acc.concat(eventCardGroup), []);

    const worldData = {
        cards: actionCards,
        events: eventData,
        eventCards: eventCards,
    }
    return worldData;
}

const exportActionCard = ({
    card,
    images
}: {
    card: CardDescriptor,
    images: CrudContext<ImageDescriptor>
}): SFF.CardData[] => {
    const description = exportCardDescription({card, images, index: 0});

    const [
        leftAction = defaultAction,
        rightAction = defaultAction
    ] = card.actions.map(exportAction);
    
    return card.conditions.map<SFF.CardData>((condition, index) => (
        Object.assign({}, description, {
            id: identityToId(card) + '[' + index + ']',
            type: 'card' as 'card',
            weight: condition.weight,
            isAvailableWhen: [exportCondition(condition)],
            actions: {
                left: leftAction,
                right: rightAction
            }
        })
    ));
}

const exportEventCard = ({
    card,
    images
}: {
    card: CardDescriptor,
    images: CrudContext<ImageDescriptor>
}): SFF.EventCard => {
    const description = exportCardDescription({card, images, index: 0});

    const [
        leftAction = defaultAction,
        rightAction = defaultAction
    ] = card.actions.map(exportAction);
    
    return Object.assign(description, {
        type: 'event' as 'event',
        actions: {
            left: leftAction,
            right: rightAction
        }
    });
}

export const exportCardDescription = ({
    card,
    images,
    index
}: {
    card: CardDescriptor,
    images?: CrudContext<ImageDescriptor>,
    index: number
}): SFF.CardDescription => {
    const image: ImageDescriptor =  images && images.get({id: card.imageId || ''}) || {
        id: '',
        name: '',
        src: '',
        tags: [],
    };

    return {
        id: identityToId(card, index),
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

const exportEvent = ({
    event,
    cards,
}: {
    event: EventDescriptor,
    cards: CrudContext<CardDescriptor>
}): SFF.WorldEvent[] => {
    const card: NamedIdentity | null = (event.initialCardId === undefined ? undefined : cards.get({id: event.initialCardId})) || null;
    return card === null ? [] : event.conditions.map<SFF.WorldEvent>((condition) => ({
        probability: condition.weight,
        shouldTriggerWhen: [exportCondition(condition)],
        initialEventCardId: identityToId(card, 0),
    }));
}


const defaultAction: SFF.CardActionData = {
    modifier: {}
};

const identityToId = (identity: NamedIdentity, index?: number): string => {
    return identity.name + ":" + identity.id + (index === undefined ? '' : '[' + index + ']');
}