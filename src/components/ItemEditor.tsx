import React from 'react';
import {
    Stack,
    IconButton,
    Dropdown,
} from 'office-ui-fabric-react';
import { stackTokens } from '../Styling';
import { useLazyUpdate } from '../LazyUpdate';

export type ItemDescriptor<T = string> = {
    id: T;
    name: string;
};

type ValueContentState<T> = {[x: string]: T};
type ValueContentActions<T> = (
    {type: 'set', id: string, value: T} |
    {type: 'unset', id: string} |
    {type: 'update', values: {[x: string]: T}}
);

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
        case 'update':
            return action.values;
    }
};

type ItemEditorProps<T = number> = {
    items: ItemDescriptor[],
    values: {[id: string]: T},
    defaultItemValue: T,
    label: string,
    onChange?: (values: {[id: string]: T}) => void,
    onRender: (item: ItemDescriptor, value: T, onChange: (id: ItemDescriptor, value: T) => void) => JSX.Element
}

export function ItemEditor<T = number>(props: ItemEditorProps<T>) {
    const {items, values, defaultItemValue, label, onChange, onRender} = props;
    const active = items.filter(i => values[i.id] !== undefined);
    const unused = items.filter(i => values[i.id] === undefined);
    
    const setContent = (valueId: string, value: T) => {
        if (onChange) onChange(valueContentReducer(values, {type: 'set', id: valueId, value: value}));
    };
    
    const unsetContent = (valueId: string) => {
        if (onChange) onChange(valueContentReducer(values, {type: 'unset', id: valueId}));
    };

    return (
        <>
            <Stack tokens={stackTokens} horizontal horizontalAlign='end' verticalAlign='end' styles={{root: {width: '100%'}}}>
                {unused.length > 0 ? (
                    <Dropdown
                        label={label}
                        options={[{id: 'select-value', name: label}, ...unused].map(value => ({key: value.id, text: value.name}))}
                        onChange={(_, __, index) => {
                            if (index !== undefined && index > 0) {
                                const item = unused[index - 1];
                                setContent(item.id, defaultItemValue);
                            }
                        }}
                        selectedKey={'select-value'}
                        styles={{root: {width: '100%'}}}
                    />
                ) : (
                    <Dropdown
                        label={label}
                        placeholder='No more values'
                        options={[]}
                        disabled
                        styles={{root: {width: '100%'}}}
                    />
                )}
            </Stack>
            {active.map(item => (
                <Stack key={item.id} tokens={stackTokens} horizontal horizontalAlign='stretch' verticalAlign='end'>
                {onRender(item, values[item.id], (i, v) => {
                    setContent(i.id, v);
                })}
                <IconButton
                    iconProps={{iconName: 'Trash'}}
                    onClick={() => {
                        unsetContent(item.id);
                    }}
                />
                </Stack>
            ))}
        </>
    );
}



export function LazyItemEditor<T = number>(props: ItemEditorProps<T>) {
    const onChange = props.onChange;
    const [state, setState] = useLazyUpdate(
        props.values,
        onChange && ((values) => {
            onChange(values)
        })
    );

    return (
        <ItemEditor {...props} values={state} onChange={setState}/>
    )
}