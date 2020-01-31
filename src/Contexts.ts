import React from 'react';
import {
    ImageDescriptor,
    ActionDescriptor,
    ParameterDescriptor,
    ParameterType,
    CardDescriptor,
    Identity,
    EventDescriptor,
} from './Types';
import {
    CrudContext,
    createtInitialCrudContext,
} from './ItemCrud';


export const ActionsContext = React.createContext<CrudContext<ActionDescriptor>>(
    createtInitialCrudContext<ActionDescriptor>(
        ['Left', 'Right'].map(name => ({id: name.toLowerCase(), name: name}))
    )
);
export const ImagesContext = React.createContext<CrudContext<ImageDescriptor>>(
    createtInitialCrudContext<ImageDescriptor>([])
);
export const CardsContext = React.createContext<CrudContext<CardDescriptor>>(
    createtInitialCrudContext<CardDescriptor>([])
);
export const EventsContext = React.createContext<CrudContext<EventDescriptor>>(
    createtInitialCrudContext<EventDescriptor>([])
)
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

export type SystemFunctions = {
    loadFile(file: File): void;
    downloadFile(name: string): void;
};
export const SystemContext = React.createContext<SystemFunctions>({
    loadFile: () => {},
    downloadFile: () => {},
});