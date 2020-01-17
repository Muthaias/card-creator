import React, { useState, useEffect, useMemo } from 'react';
import {
    Stack,
    TextField,
    Dropdown,
    Slider,
    Toggle,
} from 'office-ui-fabric-react';
import { stackTokens } from '../Styling';
import { ItemEditor, ItemDescriptor} from './ItemEditor';
import { ModifierType } from '../Types';

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
    modifierType?: ModifierType;
    defaultModifierType?: ModifierType;
    onChange?: (description: string, values: {[id: string]: number}, flags: {[id: string]: boolean}, modifierType: ModifierType) => void
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
        modifierType,
        defaultModifierType,
        description,
        onChange
    } = props;
    const [valueState, setValueState] = useState<Values>(values || defaultValues || {});
    const [flagState, setFlagState] = useState<Flags>(flags || defaultFlags || {});
    const [descriptionState, setDescriptionState] = useState(description || defaultDescription);
    const modifierTypes: ItemDescriptor<ModifierType>[] = [
        {id: 'add', name: 'Add'},
        {id: 'set', name: 'Set'},
        {id: 'replace', name: 'Replace'}
    ];
    const [modifierTypeState, setModifierTypeState] = useState(modifierType || defaultModifierType || 'add');

    const serializedValues = JSON.stringify(values);
    const serializedValueState = JSON.stringify(valueState);
    const serializedFlags = JSON.stringify(flags);
    const serializedFlagState = JSON.stringify(flagState);

    useEffect(() => {
        if (values !== undefined) setValueState(values);
    }, [serializedValues]);
    useEffect(() => {
        if (flags !== undefined) setFlagState(flags);
    }, [serializedFlags]);
    useEffect(() => {
        if (description !== undefined) setDescriptionState(description);
    }, [description]);
    useEffect(() => {
        if (modifierType !== undefined) setModifierTypeState(modifierType);
    }, [modifierType]);
    useEffect(() => {
        if(
            onChange !== undefined && (
                serializedFlagState !== serializedFlags ||
                serializedValueState !== serializedValues ||
                descriptionState !== description ||
                modifierTypeState !== modifierType
            )
        ) {
            onChange(descriptionState || '', valueState, flagState, modifierTypeState);
        }
    }, [
        descriptionState, serializedValueState, serializedFlagState, modifierTypeState,
        description, serializedValues, serializedFlags, modifierType
    ]);

    return (
        <Stack tokens={stackTokens} horizontalAlign='stretch'>
            <TextField label="Description" value={descriptionState} onChange={(_, value) => value !== undefined && setDescriptionState(value)}/>
            <Dropdown
                label='Modifier Type'
                options={modifierTypes.map(t => ({key: t.id, text: t.name}))}
                onChange={(_, __, index) => {
                    if (index !== undefined) setModifierTypeState(modifierTypes[index].id);
                }}
                selectedKey={modifierTypeState}
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
                        min={modifierType === 'set' ? 0 : -100}
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
