import React, {useState, useCallback} from 'react';
import { Image, TextField } from '@fluentui/react';
import { BaseModal } from './BaseModal';

type Props = {
    onAddImage: (name: string, src: string) => void;
    onCancel: () => void;
}

export const AddImageModal: React.FunctionComponent<Props> = (props) => {
    const {
        onAddImage,
        onCancel,
    } = props;
    const [name, setName] = useState("");
    const [src, setSrc] = useState("");
    const addImage = useCallback(() => {
        onAddImage(name, src);
    }, [src, name]);

    return (
        <BaseModal onCancel={onCancel} onConfirm={addImage}>
            <Image styles={{root: {border: 'solid 1px #000', minHeight: 200, background: '#eee'}}} src={src} width='100%'/>
            <TextField label='Name' value={name} onChange={(_, value) => value !== undefined && setName(value)}/>
            <TextField label='Source' value={src} onChange={(_, value) => value !== undefined && setSrc(value)}/>
        </BaseModal>
    );
}