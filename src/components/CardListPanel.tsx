import React, { useContext, useMemo } from 'react';
import { Identity, NamedIdentity } from '../Types';
import { Stack, DocumentCard, DocumentCardType, Text, DocumentCardPreview, DocumentCardDetails, DocumentCardTitle, Separator } from 'office-ui-fabric-react';
import { CardsContext, ImagesContext } from '../Contexts';
import { stackTokens } from '../Styling';

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
        <Stack tokens={stackTokens}>
            <Separator>Cards</Separator>
            {cards.map(c => (
                <DocumentCard key={c.id} type={DocumentCardType.compact} onClick={() => onCardSelected(c)}>
                    <DocumentCardPreview previewImages={[{previewImageSrc: c.imageSrc}]} />
                    <DocumentCardDetails>
                        <DocumentCardTitle title={c.name} />
                    </DocumentCardDetails>
                </DocumentCard>
            ))}
            {cards.length === 0 && <Stack horizontalAlign="center"><Text>No cards added</Text></Stack>}
        </Stack>
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