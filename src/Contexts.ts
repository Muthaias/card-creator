import React from 'react';
import {
    Identity,
    ImageDescriptor,
    ActionDescriptor,
    ParameterDescriptor,
    ParameterType,
    CardDescriptor
} from './Types';

type CrudContext<T> = {
    items: T[];
    update: (item: Identity & Partial<T>) => void;
    add: (item: T) => void;
    remove: (item: Identity) => void;
}
function getInitialCrudContext<T>(items: T[]) {
    return {
        items: items,
        update: () => {},
        add: () => {},
        remove: () => {},
    };
}

export const ActionsContext = React.createContext<CrudContext<ActionDescriptor>>(
    getInitialCrudContext(
        ['Left', 'Right'].map(name => ({id: name.toLowerCase(), name: name}))
    )
);
export const ImagesContext = React.createContext<CrudContext<ImageDescriptor>>(
    getInitialCrudContext([])
);
export const CardsContext = React.createContext<CrudContext<CardDescriptor>>(
    getInitialCrudContext([])
);
export const ParametersContext = React.createContext<CrudContext<ParameterDescriptor>>(
    getInitialCrudContext([
        ...[
            'Environment',
            'People',
            'Security',
            'Money'
        ].map(name => ({id: name.toLowerCase().replace(/\s+/g, '-'), name: name, type: ParameterType.Value})),
        ...[
            'Introduction Complete'
        ].map(name => ({id: name.toLowerCase().replace(/\s+/g, '-'), name: name, type: ParameterType.Flag}))
    ])
);
export const CardEditorContext = React.createContext<{
    cardId: string | null,
    setCard: (cardId: string) => void,
}>({
    cardId: null,
    setCard: () => {}
});