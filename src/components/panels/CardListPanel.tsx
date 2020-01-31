import React, { useContext, useMemo, useCallback } from 'react';
import { Identity, NamedIdentity, CardType } from '../../Types';
import { DocumentCardPreview } from 'office-ui-fabric-react';
import { CardsContext, ImagesContext } from '../../Contexts';
import { ItemListPanel } from './ItemListPanel';
import { sharedDocumentCardPreviewStyle } from './Styles';

type Props = {
    selectedCard?: Identity;
    cards: (NamedIdentity & {
        imageSrc: string;
        type: CardType;
    })[];
    onCardSelected: (card: Identity) => void;
    onAddCard?: () => void;
    onRemoveCard?: (card: Identity) => void;
}

export const CardListPanelCore: React.FunctionComponent<Props> = (props) => {
    const {cards, onCardSelected, onAddCard, onRemoveCard} = props;

    return (
        <>
            <ItemListPanel<{imageSrc: string}>
                title='Action Cards'
                emptyInfo='No action cards added'
                renderPreview={(i) => (
                    <DocumentCardPreview previewImages={[{previewImageSrc: i.imageSrc, ...sharedDocumentCardPreviewStyle}]} />
                )}
                items={cards.filter(c => c.type !== CardType.Event)}
                onItemSelected={onCardSelected}
                onAddItem={onAddCard}
                onRemoveItem={onRemoveCard}
            />
            <ItemListPanel<{imageSrc: string}>
                title='Event Cards'
                emptyInfo='No event cards added'
                renderPreview={(i) => (
                    <DocumentCardPreview previewImages={[{previewImageSrc: i.imageSrc, ...sharedDocumentCardPreviewStyle}]} />
                )}
                items={cards.filter(c => c.type === CardType.Event)}
                onItemSelected={onCardSelected}
                onAddItem={onAddCard}
                onRemoveItem={onRemoveCard}
            />
        </>
    );
}

type CardListPanelProps = {
    onCardSelected?: (card: Identity) => void;
    onAddCard?: () => void;
}

export const CardListPanel: React.FunctionComponent<CardListPanelProps> = (props) => {
    const cards = useContext(CardsContext);
    const images = useContext(ImagesContext);
    const {
        onCardSelected = () => {},
        onAddCard
    } = props;

    const cardList = useMemo(() => cards.items().map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        imageSrc: c.imageId ? (images.items().find(i => i.id === c.imageId) || {src: ''}).src : '',
    })), [cards, images]);

    const removeCard = useCallback((card: Identity) => {
        cards.delete(card);
    }, [cards]);

    return (
        <CardListPanelCore
            cards={cardList}
            onCardSelected={onCardSelected}
            onAddCard={onAddCard}
            onRemoveCard={removeCard}
        />
    );
}