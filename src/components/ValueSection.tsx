import React, { useState, useEffect } from 'react';
import {
    Stack,
    TextField,
    Dropdown,
    Slider,
    Toggle,
} from 'office-ui-fabric-react';
import { stackTokens } from '../Styling';
import { ItemEditor, ItemDescriptor} from './ItemEditor';

type Values = {[x: string]: number};
type Flags = {[x: string]: boolean};

type ValueSectionProps = {
    valueItems: ItemDescriptor[],
    flagItems: ItemDescriptor[],
    defaultValues?: Values,
    values?: Values,
    defaultFlags?: Flags,
    flags?: Flags,
    defaultDescription?: string;
    description?: string;
    defaultLocation?: string;
    location?: string;
    onChange?: (description: string, location: string, values: {[id: string]: number}, flags: {[id: string]: boolean}, modifierType: string) => void
};

export const ValueSection: React.FunctionComponent<ValueSectionProps> = (props: ValueSectionProps) => {
    const {
        valueItems,
        flagItems,
        defaultValues,
        values,
        defaultFlags,
        flags,
        defaultDescription,
        description,
        defaultLocation,
        location,
        onChange
    } = props;
    const [valueState, setValueState] = useState<Values>(values || defaultValues || {});
    const [flagState, setFlagState] = useState<Flags>(flags || defaultFlags || {});
    const [descriptionState, setDescriptionState] = useState(description || defaultDescription || '');
    const [locationState, setLocationState] = useState(location || defaultLocation || '');
    const modifierTypes: ItemDescriptor[] = [
        {id: 'add', name: 'Add'},
        {id: 'set', name: 'Set'},
        {id: 'replace', name: 'Replace'}
    ];
    const [selectedModifierType, setSelectedModifierType] = useState(modifierTypes[0]);

    useEffect(() => {
        if (values !== undefined) setValueState(values);
    }, [values]);
    useEffect(() => {
        if (flags !== undefined) setFlagState(flags);
    }, [flags]);
    useEffect(() => {
        if (description !== undefined) setDescriptionState(description);
    }, [description]);
    useEffect(() => {
        if (location !== undefined) setLocationState(location);
    }, [location]);
    useEffect(() => {
        if(onChange !== undefined) onChange(descriptionState, locationState, valueState, flagState, selectedModifierType.id);
    }, [descriptionState, locationState, valueState, flagState, selectedModifierType.id]);

    return (
        <Stack tokens={stackTokens} horizontalAlign='stretch'>
            <TextField label="Description" value={descriptionState} onChange={(_, value) => value !== undefined && setDescriptionState(value)}/>
            <TextField label="Location" value={locationState} onChange={(_, value) => value !== undefined && setLocationState(value)}/>
            <Dropdown
                label='Modifier Type'
                options={modifierTypes.map(t => ({key: t.id, text: t.name}))}
                onChange={(_, __, index) => {
                    if (index !== undefined) setSelectedModifierType(modifierTypes[index]);
                }}
                selectedKey={selectedModifierType.id}
                styles={{root: {width: '100%'}}}
            />
            <ItemEditor<number>
                items={valueItems}
                label={"Select Value"}
                values={valueState}
                defaultItemValue={0}
                onChange={(values) => setValueState(values)}
                onRender={(item, value, onValueChange) => (
                    <Slider
                        key={item.id}
                        onChange={(v) => {
                            onValueChange(item, v);
                        }}
                        label={item.name}
                        min={selectedModifierType.id === 'set' ? 0 : -100}
                        max={100}
                        step={1}
                        value={value}
                        showValue
                        originFromZero
                        styles={{root: {width: '100%'}}}
                    />
                )}
            />
            <ItemEditor<boolean>
                items={flagItems}
                label={"Select Flag"}
                values={flagState}
                defaultItemValue={true}
                onChange={(values) => setFlagState(values)}
                onRender={(item, value, onValueChange) => (
                    <Toggle
                        key={item.id}
                        onChange={(_, v) => {
                            if (v !== undefined) onValueChange(item, v);
                        }}
                        label={item.name}
                        checked={value}
                        styles={{root: {width: '100%'}}}
                    />
                )}
            />
        </Stack>
    )
}
