import React, { useContext, useMemo, useCallback } from 'react';
import { Identity, NamedIdentity } from '../../Types';
import { DocumentCardPreview } from 'office-ui-fabric-react';
import { ImagesContext } from '../../Contexts';
import { ItemListPanel } from './ItemListPanel';
import { sharedDocumentCardPreviewStyle } from './Styles';

type Props = {
    selectedImage?: Identity;
    images: (NamedIdentity & {
        imageSrc: string;
    })[];
    onImageSelected: (card: Identity) => void;
    onAddImage?: () => void;
    onRemoveImage?: (image: Identity) => void;
}

export const ImageListPanelCore: React.FunctionComponent<Props> = (props) => {
    const {images, onImageSelected, onAddImage, onRemoveImage} = props;

    return (
        <ItemListPanel<{imageSrc: string}>
            title='Images'
            emptyInfo='No images added'
            renderPreview={(i) => (
                <DocumentCardPreview previewImages={[{previewImageSrc: i.imageSrc, ...sharedDocumentCardPreviewStyle}]} />
            )}
            items={images}
            onRemoveItem={onRemoveImage}
            onAddItem={onAddImage}
            onItemSelected={onImageSelected}
        />
    );
}

type ImageListPanelProps = {
    onImageSelected?: (card: Identity) => void;
    onAddImage?: () => void;
}

export const ImageListPanel: React.FunctionComponent<ImageListPanelProps> = (props) => {
    const images = useContext(ImagesContext);

    const onImageSelected = props.onImageSelected === undefined ? () => {} : props.onImageSelected;
    const onAddImage = props.onAddImage;

    const imageList = useMemo(() => images.items().map(item => ({
        id: item.id,
        name: item.name,
        imageSrc: item.src,
    })), [images]);

    const removeImage = useCallback((image: Identity) => {
        images.delete(image);
    }, [images]);

    return (
        <ImageListPanelCore
            images={imageList}
            onImageSelected={onImageSelected}
            onAddImage={onAddImage}
            onRemoveImage={removeImage}
        />
    );
}