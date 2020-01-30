import React, {useState, useEffect} from 'react';

export function stateToSerializedData<P>(state: P): string[] {
    return [JSON.stringify(state)];
}

export function equalityStatePropCompare<D>(stateData: D[], propData: D[]): boolean {
    return !stateData.some((value, index) => value !== propData[index]);
}

export function useGenericLazyUpdate<P, D>(
    props: P,
    timeout: number,
    stateToData: (state: P) => D[],
    compareData: (state: D[], props: D[]) => boolean,
    onChange?: (state: P) => void,
) {
    const [state, setState] = useState(props);

    const stateData = stateToData(state);
    const propData = stateToData(props);
    useEffect(() => {
        if (!compareData(stateData, propData) && onChange) {
            const timer = setTimeout(() => {
                if (onChange) onChange(state);
            }, timeout);
            return () => {
                clearTimeout(timer);
            }
        }
    }, stateData);
    useEffect(() => {
        if (!compareData(stateData, propData)) {
            setState(props);
        }
    }, propData);

    return [state, setState] as [P, React.Dispatch<React.SetStateAction<P>>];
}

export function useLazyUpdate<P>(
    props: P,
    onChange?: (state: P) => void,
    timeout: number = 1000,
) {
    return useGenericLazyUpdate<P, string>(props, 1000, stateToSerializedData, equalityStatePropCompare, onChange);
}