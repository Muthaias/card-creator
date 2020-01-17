import React from 'react';
import {
    ImageDescriptor,
    ActionDescriptor,
    ParameterDescriptor,
    ParameterType,
    CardDescriptor,
    Identity,
} from './Types';
import {
    CrudContext,
    createtInitialCrudContext,
} from './ItemCrud';


export const ActionsContext = React.createContext<CrudContext<ActionDescriptor>>(
    createtInitialCrudContext(
        ['Left', 'Right'].map(name => ({id: name.toLowerCase(), name: name}))
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

export type CardEditorManager = {
    cardId: string | null;
    setCard: (card: Identity) => void;
};

export const CardEditorContext = React.createContext<CardEditorManager>({
    cardId: null,
    setCard: () => {}
});

export type RouteManager = {
    route: string[];
    viewCard: (card: Identity) => void;
    viewAnalyzeCards: () => void;
    viewParameterList: () => void;
    viewCardList: () => void;
    viewImageList: () => void;
    viewActionList: () => void;
};

export const RouteContext = React.createContext<RouteManager>({
    route: [""],
    viewCard: () => {},
    viewAnalyzeCards: () => {},
    viewParameterList: () => {},
    viewCardList: () => {},
    viewImageList: () => {},
    viewActionList: () => {},
});