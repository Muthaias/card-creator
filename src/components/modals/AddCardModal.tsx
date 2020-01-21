import React, {useState, useCallback} from 'react';
import { Image, TextField, Dropdown } from 'office-ui-fabric-react';
import { BaseModal } from './BaseModal';

type Props = {
    onAddCard: (name: string) => void;
    onCancel: () => void;
}

export const AddCardModal: React.FunctionComponent<Props> = (props) => {
    const {
        onAddCard,
        onCancel,
    } = props;
    const [name, setName] = useState("");
    const addCard = useCallback(() => {
        onAddCard(name);
    }, [name]);

    return (
        <BaseModal onCancel={onCancel} onConfirm={addCard}>
            <TextField label='Name' value={name} onChange={(_, value) => value !== undefined && setName(value)}/>
        </BaseModal>
    );
}