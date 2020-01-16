import React from 'react';
import {
    ImageDescriptor,
    ActionDescriptor,
    ParameterDescriptor,
    ParameterType,
    CardDescriptor
} from './Types';
import {
    CrudContext,
    createtInitialCrudContext,
} from './ItemCrud';


export const ActionsContext = React.createContext<CrudContext<ActionDescriptor>>(
    createtInitialCrudContext(
        ['Left', 'Right', 'Star'].map(name => ({id: name.toLowerCase(), name: name}))
    )
);
export const ImagesContext = React.createContext<CrudContext<ImageDescriptor>>(
    createtInitialCrudContext([])
);
export const CardsContext = React.createContext<CrudContext<CardDescriptor>>(
    createtInitialCrudContext([])
);
export const ParametersContext = React.createContext<CrudContext<ParameterDescriptor>>(
    createtInitialCrudContext([
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