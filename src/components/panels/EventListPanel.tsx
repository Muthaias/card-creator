import React, { useContext, useMemo, useCallback } from 'react';
import { Identity, NamedIdentity, ImageDescriptor } from '../../Types';
import { DocumentCardPreview } from 'office-ui-fabric-react';
import { EventsContext, CardsContext, ImagesContext } from '../../Contexts';
import { ItemListPanel } from './ItemListPanel';

type Props = {
    selectedEvent?: Identity;
    events: (NamedIdentity & {
        card?: NamedIdentity & {
            imageSrc: string,
        },
    })[];
    onEventSelected?: (event: Identity) => void;
    onAddEvent?: () => void;
    onRemoveEvent?: (event: Identity) => void;
}

export const EventListPanelCore: React.FunctionComponent<Props> = (props) => {
    const {
        events,
        onEventSelected = () => {},
        onAddEvent,
        onRemoveEvent
    } = props;

    const assignedEvents = events.filter(e => !!e.card);
    const unassignedEvents = events.filter(e => !e.card);

    return (
        <>
            <ItemListPanel<{card?: NamedIdentity & {imageSrc: string}}>
                title='Assigned Events'
                emptyInfo='No assigned events'
                renderPreview={(i) => (
                    <DocumentCardPreview previewImages={[{previewImageSrc: i.card && i.card.imageSrc, width: 144}]} />
                )}
                items={assignedEvents}
                onRemoveItem={onRemoveEvent}
                onAddItem={onAddEvent}
                onItemSelected={onEventSelected}
            />
            <ItemListPanel<{card?: NamedIdentity & {imageSrc: string}}>
                title='Unassigned Events'
                emptyInfo='No unassigned events'
                renderPreview={(i) => (
                    <DocumentCardPreview previewImages={[{previewImageSrc: i.card && i.card.imageSrc, width: 144}]} />
                )}
                items={unassignedEvents}
                onRemoveItem={onRemoveEvent}
                onAddItem={onAddEvent}
                onItemSelected={onEventSelected}
            />
        </>
    );
}

type EventListPanelProps = {
    onAddEvent?: () => void;
    onEventSelected?: (event: Identity) => void;
}

export const EventListPanel: React.FunctionComponent<EventListPanelProps> = ({
    onAddEvent,
    onEventSelected
}) => {
    const events = useContext(EventsContext);
    const cards = useContext(CardsContext);
    const images = useContext(ImagesContext);
    const getCardData = (cardId: string) => {
        const card = cards.get({id: cardId});
        const image: ImageDescriptor | undefined = (
            card !== undefined && card.imageId !== undefined
        ) ? images.get({id: card.imageId}) : undefined;
        return card === undefined ? undefined : {
            id: card.id,
            name: card.name,
            imageSrc: image && image.src || '',
        };
    };
    const eventList: Props['events'] = events.items().map(e => ({
        id: e.id,
        name: e.name,
        card: e.initialCardId !== undefined ? getCardData(e.initialCardId) : undefined,
    }));
    const removeEvent = useCallback((event: Identity) => {
        events.delete(event);
    }, [events]);
    return (
        <EventListPanelCore 
            events={eventList}
            onAddEvent={onAddEvent}
            onEventSelected={onEventSelected}
            onRemoveEvent={removeEvent}
        />
    );
}