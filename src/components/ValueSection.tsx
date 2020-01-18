import React, { useState, useEffect, useMemo } from 'react';
import {
    Stack,
    TextField,
    Dropdown,
    Slider,
    Toggle,
    updateA,
} from 'office-ui-fabric-react';
import { stackTokens } from '../Styling';
import { ItemEditor, ItemDescriptor} from './ItemEditor';
import { ModifierType } from '../Types';

type Values = {[x: string]: number};
type Flags = {[x: string]: boolean};

type ValueSectionProps = {
    valueItems: ItemDescriptor[],
    flagItems: ItemDescriptor[],
    values: Values,
    flags: Flags,
    description: string;
    modifierType: ModifierType;
    onChange?: (description: string, values: {[id: string]: number}, flags: {[id: string]: boolean}, modifierType: ModifierType) => void
};

export const ValueSection: React.FunctionComponent<ValueSectionProps> = (props: ValueSectionProps) => {
    const {
        values,
        flags,
        modifierType,
        description,
        onChange,
        valueItems,
        flagItems,
    } = props;

    const modifierTypes: ItemDescriptor<ModifierType>[] = [
        {id: 'add', name: 'Add'},
        {id: 'set', name: 'Set'},
        {id: 'replace', name: 'Replace'}
    ];
    const update = (d?: string, v?: Values, f?: Flags, m?: ModifierType) => {
        if (onChange) onChange(
            d || description,
            v || values,
            f || flags,
            m || modifierType,
        );
    }
    const setModifierType = (type: ModifierType) => update(undefined, undefined, undefined, type);
    const setDescription = (desc: string) => update(desc);
    const setValues = (vs: Values) => update(undefined, vs);
    const setFlags = (fs: Flags) => update(undefined, undefined, fs);

    return (
        <Stack tokens={stackTokens} horizontalAlign='stretch'>
            <TextField label="Description" value={description} onChange={(_, value) => value !== undefined && setDescription(value)}/>
            <Dropdown
                label='Modifier Type'
                options={modifierTypes.map(t => ({key: t.id, text: t.name}))}
                onChange={(_, __, index) => {
                    if (index !== undefined) setModifierType(modifierTypes[index].id);
                }}
                selectedKey={modifierType}
                styles={{root: {width: '100%'}}}
            />
            <ItemEditor<number>
                items={valueItems}
                label={"Select Value"}
                values={values}
                defaultItemValue={0}
                onChange={(values) => setValues(values)}
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
                values={flags}
                defaultItemValue={true}
                onChange={(values) => setFlags(values)}
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

export const LazyValueSection: React.FunctionComponent<ValueSectionProps> = (props) => {
    const propData = {
        description: props.description,
        values: props.values,
        flags: props.flags,
        modifierType: props.modifierType,
    };
    const [state, setState] = useState(propData);

    const serializedState = JSON.stringify(state);
    const serializedPropData = JSON.stringify(propData);
    useEffect(() => {
        const onChange = props.onChange;
        if (serializedState !== serializedPropData && onChange) {
            const timer = setTimeout(() => {
                if (onChange) onChange(state.description, state.values, state.flags, state.modifierType);
            }, 1000);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [serializedState]);
    useEffect(() => {
        if (serializedState !== serializedPropData) {
            setState(propData);
        }
    }, [serializedPropData])

    return (
        <ValueSection {...props} {...state} onChange={(d, v, f, m) => setState({
            description: d,
            values: v,
            flags: f,
            modifierType: m,
        })}/>
    )
}