import React, { useState, useReducer, useEffect } from 'react';
import {
    Stack,
    IconButton,
    DefaultButton,
    Dropdown,
} from 'office-ui-fabric-react';
import { stackTokens } from '../Styling';

export type ItemDescriptor = {
    id: string;
    name: string;
};

const valueControlReducer = (
    state: {active: ItemDescriptor[], unused: ItemDescriptor[]},
    action: {type: 'add' | 'remove', id: string}
) => {
    switch (action.type) {
        case 'add':
        return {
            active: [...state.active, ...state.unused.filter(v => v.id === action.id)],
            unused: state.unused.filter(v => v.id !== action.id),
        };
        case 'remove':
        return {
            active: state.active.filter(v => v.id !== action.id),
            unused: [...state.unused, ...state.active.filter(v => v.id === action.id)],
        };
    }
    return state;
};

const valueControlInit = ({valueSet, valueIds}: {valueSet: ItemDescriptor[], valueIds: string[]}) => ({
    active: valueSet.filter(v => valueIds.includes(v.id)),
    unused: valueSet.filter(v => !valueIds.includes(v.id)),
});

type ValueContentState<T> = {[x: string]: T};
type ValueContentActions<T> = (
    {type: 'set', id: string, value: T} |
    {type: 'unset', id: string}
);
type ValueContentReducer<T = number> = (
    state: ValueContentState<T>,
    action: ValueContentActions<T>
) => ValueContentState<T>;

function valueContentReducer<T = number>(
    state: ValueContentState<T>,
    action: ValueContentActions<T>
) {
    switch(action.type) {
    case 'set':
        return Object.assign({}, state, {[action.id]: action.value});
    case 'unset':
        const result = Object.entries(state).reduce<{[x: string]: T}>((acc, [key, value]) => {
        if (action.id !== key) {
            acc[key] = value;
        }
        return acc;
        }, {});
        return result;
    }
    return state;
};

export function ItemEditor<T = number>(props: {
    items: ItemDescriptor[],
    initialItemIds: string[],
    itemDefaultValue: T,
    onChange?: (values: {[id: string]: T}) => void,
    onRender: (item: ItemDescriptor, value: T, onChange: (id: ItemDescriptor, value: T) => void) => JSX.Element
}) {
    const {items, initialItemIds, itemDefaultValue, onChange, onRender} = props;
    const [{active, unused}, dispatchActiveValues] = useReducer(
        valueControlReducer,
        {valueSet: items, valueIds: initialItemIds},
        valueControlInit
    );
    const [itemContent, dispatchItemContent] = useReducer<ValueContentReducer<T>>(
        valueContentReducer,
        {}
    );
    const [selectedItem, setSelectedItem] = useState(unused[0]);
    const addValue = (valueId: string) => dispatchActiveValues({type: 'add', id: valueId});
    const removeValue = (valueId: string) => dispatchActiveValues({type: 'remove', id: valueId});
    const setContent = (valueId: string, value: T) => dispatchItemContent({type: 'set', id: valueId, value: value});
    const unsetContent = (valueId: string) => dispatchItemContent({type: 'unset', id: valueId});
    
    useEffect(() => {
        if(onChange !== undefined) onChange(itemContent);
    });

    return (
        <>
            <Stack tokens={stackTokens} horizontal horizontalAlign='end' verticalAlign='end' styles={{root: {width: '100%'}}}>
                {unused.length > 0 ? (
                    <Dropdown
                        label='Select Value'
                        options={[{id: 'select-value', name: 'Select Value'}, ...unused].map(value => ({key: value.id, text: value.name}))}
                        onChange={(_, __, index) => {
                            if (index !== undefined && index > 0) {
                                const item = unused[index - 1];
                                addValue(item.id);
                                setContent(item.id, itemDefaultValue);
                            }
                        }}
                        selectedKey={'select-value'}
                        styles={{root: {width: '100%'}}}
                    />
                ) : (
                    <Dropdown
                        label='No more values'
                        placeholder='No more values'
                        options={[]}
                        disabled
                        styles={{root: {width: '100%'}}}
                    />
                )}
            </Stack>
            {active.map(item => (
                <Stack key={item.id} tokens={stackTokens} horizontal horizontalAlign='stretch' verticalAlign='end'>
                {onRender(item, itemContent[item.id] === undefined ? itemDefaultValue : itemContent[item.id], (i, v) => {
                    setContent(i.id, v);
                })}
                <IconButton
                    iconProps={{iconName: 'Trash'}}
                    onClick={() => {
                        removeValue(item.id);
                        unsetContent(item.id);
                        setSelectedItem(item);
                    }}
                />
                </Stack>
            ))}
        </>
    );
}