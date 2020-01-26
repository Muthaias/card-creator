import React, {useState, useCallback} from 'react';
import { TextField } from 'office-ui-fabric-react';
import { BaseModal } from './BaseModal';

type Props = {
    onAddEvent: (name: string) => void;
    onCancel: () => void;
}

export const AddEventModal: React.FunctionComponent<Props> = (props) => {
    const {
        onAddEvent,
        onCancel,
    } = props;
    const [name, setName] = useState("");
    const addCard = useCallback(() => {
        onAddEvent(name);
    }, [name]);

    return (
        <BaseModal onCancel={onCancel} onConfirm={addCard}>
            <TextField label='Name' value={name} onChange={(_, value) => value !== undefined && setName(value)}/>
        </BaseModal>
    );
}