import React, { useState, useReducer, useEffect } from 'react';
import {
    Stack,
    IconButton,
    DefaultButton,
    TextField,
    Dropdown,
    Slider,
    Toggle,
} from 'office-ui-fabric-react';
import { stackTokens } from '../Styling';
import { ItemEditor, ItemDescriptor} from './ItemEditor';

type Props = {
    initialValueIds: string[],
    values: ItemDescriptor[],
    initialFlagIds: string[],
    flags: ItemDescriptor[],
    onChange?: (description: string, values: {[id: string]: number}, flags: {[id: string]: boolean}, modifierType: string) => void
};

export const ValueSection: React.FunctionComponent<Props> = (props) => {
    const {values, initialValueIds, flags, initialFlagIds, onChange} = props;
    const [valueContent, setValueContent] = useState<{[x: string]: number}>({});
    const [flagContent, setFlagContent] = useState<{[x: string]: boolean}>({});
    const [description, setDescription] = useState('');
    const modifierTypes: ItemDescriptor[] = [
        {id: 'add', name: 'Add'},
        {id: 'set', name: 'Set'}
    ];
    const [selectedModifierType, setSelectedModifierType] = useState(modifierTypes[0]);
    useEffect(() => {
        if(onChange !== undefined) onChange(description, valueContent, flagContent, selectedModifierType.id);
    }, [description, valueContent, flagContent, selectedModifierType.id]);

    return (
        <Stack tokens={stackTokens} horizontalAlign='stretch'>
            <TextField label="Description" value={description} onChange={(_, value) => value !== undefined && setDescription(value)}/>
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
                items={values}
                initialItemIds={initialValueIds}
                itemDefaultValue={0}
                onChange={(values) => setValueContent(values)}
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
                items={flags}
                initialItemIds={initialFlagIds}
                itemDefaultValue={true}
                onChange={(values) => setFlagContent(values)}
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
