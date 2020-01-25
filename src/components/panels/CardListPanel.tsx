import React, { useContext, useMemo } from 'react';
import { Identity, NamedIdentity, CardType } from '../../Types';
import { DocumentCardPreview } from 'office-ui-fabric-react';
import { CardsContext, ImagesContext } from '../../Contexts';
import { ItemListPanel } from './ItemListPanel';

type Props = {
    selectedCard?: Identity;
    cards: (NamedIdentity & {
        imageSrc: string;
        type: CardType;
    })[];
    onCardSelected: (card: Identity) => void;
    onAddCard?: () => void;
}

export const CardListPanelCore: React.FunctionComponent<Props> = (props) => {
    const {cards, onCardSelected, onAddCard} = props;

    return (
        <>
            <ItemListPanel<{imageSrc: string}>
                title='Action Cards'
                emptyInfo='No action cards added'
                renderPreview={(i) => (
                    <DocumentCardPreview previewImages={[{previewImageSrc: i.imageSrc, width: 144}]} />
                )}
                items={cards.filter(c => c.type !== CardType.Event)}
                onItemSelected={onCardSelected}
                onAddItem={onAddCard}
            />
            <ItemListPanel<{imageSrc: string}>
                title='Event Cards'
                emptyInfo='No event cards added'
                renderPreview={(i) => (
                    <DocumentCardPreview previewImages={[{previewImageSrc: i.imageSrc, width: 144}]} />
                )}
                items={cards.filter(c => c.type === CardType.Event)}
                onItemSelected={onCardSelected}
                onAddItem={onAddCard}
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

    return (
        <CardListPanelCore cards={cardList} onCardSelected={onCardSelected} onAddCard={onAddCard}/>
    );
}