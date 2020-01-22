import { CrudContext } from '../ItemCrud'
import { ImageDescriptor, CardDescriptor, CardCondition, ActionData } from '../Types'
import * as SFF from '../SFFTypes';

export const exportGameWorld = ({
    cards,
    images
}: {
    cards: CrudContext<CardDescriptor>
    images: CrudContext<ImageDescriptor>
}) => {
    const cardItems = cards.items();
    const cardData = cardItems.map(card => exportCard({card, images}));

    return {
        cards: cardData,
        events: [],
        eventCards: [],
    }
}

const exportCard = ({
    card,
    images
}: {
    card: CardDescriptor,
    images: CrudContext<ImageDescriptor>
}): SFF.CardData => {
    const image: ImageDescriptor =  images.get({id: card.imageId || ''}) || {
        id: '',
        name: '',
        src: '',
        tags: [],
    };

    const isAvailableWhen = card.conditions.map(exportCondition);
    const [
        leftAction = defaultAction,
        rightAction = defaultAction
    ] = card.actions.map(exportAction);

    // TODO: Use weights from all conditions when supported in SFF
    const weight = card.conditions[0] && card.conditions[0].weight || 1;
    
    return {
        type: 'card',
        image: image.src,
        title: card.name,
        text: card.text,
        weight,
        distance: card.location,
        isAvailableWhen,
        actions: {
            left: leftAction,
            right: rightAction
        }
    }
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


const defaultAction: SFF.CardActionData = {
    modifier: {}
};