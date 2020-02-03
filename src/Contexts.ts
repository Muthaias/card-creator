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
    createInitialCrudContext,
} from './ItemCrud';


export const ActionsContext = React.createContext<CrudContext<ActionDescriptor>>(
    createInitialCrudContext<ActionDescriptor>(
        ['Left', 'Right'].map(name => ({id: name.toLowerCase(), name: name}))
    )
);
export const ImagesContext = React.createContext<CrudContext<ImageDescriptor>>(
    createInitialCrudContext<ImageDescriptor>([])
);
export const CardsContext = React.createContext<CrudContext<CardDescriptor>>(
    createInitialCrudContext<CardDescriptor>([])
);
export const EventsContext = React.createContext<CrudContext<EventDescriptor>>(
    createInitialCrudContext<EventDescriptor>([])
)
export const ParametersContext = React.createContext<CrudContext<ParameterDescriptor>>(
    createInitialCrudContext([
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