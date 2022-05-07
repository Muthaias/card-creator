import {createContext} from 'react';
import {
    ImageDescriptor,
    ActionDescriptor,
    ParameterDescriptor,
    ParameterType,
    CardDescriptor,
    EventDescriptor,
} from './Types';
import {
    CrudContext,
    createInitialCrudContext,
} from './ItemCrud';


export const ActionsContext = createContext<CrudContext<ActionDescriptor>>(
    createInitialCrudContext<ActionDescriptor>(
        ['Left', 'Right'].map(name => ({id: name.toLowerCase(), name: name}))
    )
);
export const ImagesContext = createContext<CrudContext<ImageDescriptor>>(
    createInitialCrudContext<ImageDescriptor>([])
);
export const CardsContext = createContext<CrudContext<CardDescriptor>>(
    createInitialCrudContext<CardDescriptor>([])
);
export const EventsContext = createContext<CrudContext<EventDescriptor>>(
    createInitialCrudContext<EventDescriptor>([])
)
export const ParametersContext = createContext<CrudContext<ParameterDescriptor>>(
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
export const SystemContext = createContext<SystemFunctions>({
    loadFile: () => {},
    downloadFile: () => {},
});