import React, { useState, useCallback } from 'react';
import { TextField, Text } from 'office-ui-fabric-react';
import { BaseModal } from './BaseModal';

type Props = {
    onExport: (name: string) => void;
    onCancel: () => void;
}

export const ExportGameWorldModal: React.FunctionComponent<Props> = (props) => {
    const {
        onExport,
        onCancel,
    } = props;
    const [name, setName] = useState("");
    const exportGameWorld = useCallback(() => {
        onExport(name);
    }, [name]);

    return (
        <BaseModal onCancel={onCancel} onConfirm={exportGameWorld}>
            <Text>Choose a name for your game world to export:</Text>
            <TextField label='Name' value={name} onChange={(_, value) => value !== undefined && setName(value)} />
        </BaseModal>
    );
}