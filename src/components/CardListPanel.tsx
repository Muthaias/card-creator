import React, { useContext, useMemo } from 'react';
import { Identity, NamedIdentity } from '../Types';
import { Stack, DocumentCard, DocumentCardType, Text, DocumentCardPreview, DocumentCardDetails, DocumentCardTitle, Separator } from 'office-ui-fabric-react';
import { CardsContext, ImagesContext } from '../Contexts';
import { stackTokens } from '../Styling';
import { ItemListPanel } from './ItemListPanel';

type Props = {
    selectedCard?: Identity;
    cards: (NamedIdentity & {
        imageSrc: string;
    })[];
    onCardSelected: (card: Identity) => void;
}

export const CardListPanelCore: React.FunctionComponent<Props> = (props) => {
    const {cards, onCardSelected} = props;

    return (
        <ItemListPanel<{imageSrc: string}>
            title='Cards'
            emptyInfo='No cards added'
            renderPreview={(i) => (
                <DocumentCardPreview previewImages={[{previewImageSrc: i.imageSrc, width: 144}]} />
            )}
            items={cards}
            onItemSelected={onCardSelected}
        />
    );
}

type CardListPanelProps = {
    onCardSelected?: (card: Identity) => void;
}

export const CardListPanel: React.FunctionComponent<CardListPanelProps> = (props) => {
    const cards = useContext(CardsContext);
    const images = useContext(ImagesContext);

    const onCardSelected = props.onCardSelected === undefined ? () => {} : props.onCardSelected;

    const cardList = useMemo(() => cards.items.map(c => ({
        id: c.id,
        name: c.name,
        imageSrc: c.imageId ? (images.items.find(i => i.id === c.imageId) || {src: ''}).src : '',
    })), [cards, images]);

    return (
        <CardListPanelCore cards={cardList} onCardSelected={onCardSelected}/>
    );
}