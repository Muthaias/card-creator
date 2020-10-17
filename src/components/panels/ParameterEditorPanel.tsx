import React, { useContext } from 'react';
import { Stack, IconButton, TextField, Separator, Text } from '@fluentui/react';
import { ParameterDescriptor, ParameterType, Identity } from '../../Types';
import { ParametersContext } from '../../Contexts';
import { stackTokens } from '../../Styling';

type Props = {
    parameters: ParameterDescriptor[];
    onUpdate(parameter: Identity & Partial<ParameterDescriptor>): void;
    onRemove(parameter: Identity): void;
    onAdd(parameter: ParameterDescriptor): void;
}

export const ParameterEditorCore: React.FunctionComponent<Props> = (props) => {
    const {
        parameters,
        onUpdate,
        onRemove,
        onAdd,
    } = props;

    return (
        <Stack tokens={stackTokens} styles={{root: {width: "100%"}}}>
            {[{name: 'Values', type: ParameterType.Value}, {name: 'Flags', type: ParameterType.Flag}].map(({name, type}) => (
                <React.Fragment key={type}>
                    <Stack horizontal styles={{root: {width: "100%"}}}>
                        <Separator styles={{root: {width: "100%"}}}>{name}</Separator>
                        <IconButton
                            iconProps={{iconName: 'Add'}}
                            onClick={() => {
                                onAdd({
                                    id: [type, Date.now()].join("-"),
                                    name: "",
                                    type: type,
                                });
                            }}
                        />
                    </Stack>
                    {parameters.filter(p => p.type === type).map(p => (
                        <Stack horizontal key={p.id} tokens={stackTokens} styles={{root: {width: "100%"}}}>
                            <TextField
                                styles={{root: {width: "100%"}}}
                                value={p.name}
                                onChange={(_, newValue) => {
                                    if (newValue !== undefined) {
                                        onUpdate({id: p.id, name: newValue});
                                    }
                                }}
                            />
                            {!p.systemParameter && <IconButton
                                iconProps={{iconName: 'Trash'}}
                                onClick={() => {
                                    onRemove(p);
                                }}
                            />}
                        </Stack>
                    ))}
                    {parameters.filter(p => p.type === type).length === 0 && <Stack horizontalAlign="center"><Text>No parameters of type '{type}' added</Text></Stack>}
                </React.Fragment>
            ))}
        </Stack>
    );
}

export const ParameterEditorPanel: React.FunctionComponent<{}> = () => {
    const parameters = useContext(ParametersContext);
    return (
        <ParameterEditorCore
            parameters={parameters.items()}
            onUpdate={parameters.update}
            onAdd={parameters.create}
            onRemove={parameters.delete}
        />
    );
}