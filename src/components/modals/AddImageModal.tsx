import React, {useState, useCallback} from 'react';
import { Stack, Image, TextField, DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { stackTokens } from '../../Styling';

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
        <Stack tokens={Object.assign({}, stackTokens, {padding: 20})}>
            <Stack horizontal tokens={stackTokens}>
                <Image styles={{root: {border: 'solid 1px #000'}}} src={src} width={200} height={200} />
                <Stack tokens={stackTokens}>
                    <TextField label='Name' value={name} onChange={(_, value) => value !== undefined && setName(value)}/>
                    <TextField label='Source' value={src} onChange={(_, value) => value !== undefined && setSrc(value)}/>
                </Stack>
            </Stack>
            <Stack horizontal tokens={stackTokens} horizontalAlign='space-between'>
                <DefaultButton onClick={onCancel}>Cancel</DefaultButton>
                <PrimaryButton onClick={addImage}>Create Image</PrimaryButton>
            </Stack>
        </Stack>
    );
}