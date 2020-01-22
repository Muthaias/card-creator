import React, { useState, useCallback } from 'react';
import { TextField, Text } from 'office-ui-fabric-react';
import { BaseModal } from './BaseModal';

type Props = {
    onExport: (id: string) => void;
    onCancel: () => void;
}

export const ExportGameWorldModal: React.FunctionComponent<Props> = (props) => {
    const {
        onExport,
        onCancel,
    } = props;
    const [id, setId] = useState("");
    const exportGameWorld = useCallback(() => {
        onExport(id);
    }, [id]);
    const setAdjustedId = (id: string) => {
        setId(id.replace(/(-|\s)+/g, '-').toLowerCase());
    }

    return (
        <BaseModal onCancel={onCancel} onConfirm={exportGameWorld}>
            <Text>Choose a id for your game world to export:</Text>
            <TextField label='Id' value={id} onChange={(_, value) => value !== undefined && setAdjustedId(value)} />
        </BaseModal>
    );
}