import React, { useContext, useMemo } from 'react';
import { Identity, NamedIdentity } from '../Types';
import { DocumentCardPreview } from 'office-ui-fabric-react';
import { CardsContext, ImagesContext } from '../Contexts';
import { ItemListPanel } from './ItemListPanel';

type Props = {
    selectedCard?: Identity;
    cards: (NamedIdentity & {
        imageSrc: string;
    })[];
    onCardSelected: (card: Identity) => void;
    onAddCard?: () => void;
}

export const CardListPanelCore: React.FunctionComponent<Props> = (props) => {
    const {cards, onCardSelected, onAddCard} = props;

    return (
        <ItemListPanel<{imageSrc: string}>
            title='Cards'
            emptyInfo='No cards added'
            renderPreview={(i) => (
                <DocumentCardPreview previewImages={[{previewImageSrc: i.imageSrc, width: 144}]} />
            )}
            items={cards}
            onItemSelected={onCardSelected}
            onAddItem={onAddCard}
        />
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


    const cardList = useMemo(() => cards.items.map(c => ({
        id: c.id,
        name: c.name,
        imageSrc: c.imageId ? (images.items.find(i => i.id === c.imageId) || {src: ''}).src : '',
    })), [cards, images]);

    return (
        <CardListPanelCore cards={cardList} onCardSelected={onCardSelected} onAddCard={onAddCard}/>
    );
}