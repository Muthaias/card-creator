import React, {useState, useEffect} from 'react';

export function useLazyUpdate<P>(propData: P, onChange?: (state: P) => void, timeout: number = 1000) {
    const [state, setState] = useState(propData);

    const serializedState = JSON.stringify(state);
    const serializedPropData = JSON.stringify(propData);
    useEffect(() => {
        if (serializedState !== serializedPropData && onChange) {
            const timer = setTimeout(() => {
                if (onChange) onChange(state);
            }, timeout);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [serializedState]);
    useEffect(() => {
        if (serializedState !== serializedPropData) {
            setState(propData);
        }
    }, [serializedPropData]);

    return [state, setState] as [P, React.Dispatch<React.SetStateAction<P>>];
}