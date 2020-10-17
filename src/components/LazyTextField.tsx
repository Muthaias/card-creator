import React from 'react';
import { TextField, ITextFieldProps } from '@fluentui/react';
import { useLazyUpdate } from '../LazyUpdate';

export const LazyTextField: React.FunctionComponent<ITextFieldProps & {onChange: (ev: void, value?: string) => void}> = (props) => {
    const onChange = props.onChange;
    const [state, setState] = useLazyUpdate(
        props.value,
        onChange && ((value) => {
            onChange(undefined, value);
        })
    );

    return (
        <TextField {...props} value={state} onChange={(_, value) => {
            setState(value);
        }}/>
    )
}