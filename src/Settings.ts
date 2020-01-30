import React, {useReducer, Reducer} from 'react';

export type Settings = {
    exportTargetId: string;
    targetRestRoot: string;
    downloadFileName: string;
    saveDelay: number;
    exportDelay: number;
}


function settingsReducer<S> (state: S, action: Partial<S>): S {
    return Object.assign({}, state, action);
}

export function useSettings<S = Settings>(defaultSettings: S): {settings: S, update: React.Dispatch<Partial<S>>} {
    const [settings, dispatchSettings] = useReducer<Reducer<S, Partial<S>>, S>(
        (s: S, a: Partial<S>) => settingsReducer<S>(s, a),
        defaultSettings,
        () => defaultSettings,
    );
    return Object.assign({
        settings: settings,
        update: dispatchSettings,
    });
}

export const SettingsContext = React.createContext<{settings: Settings, update: React.Dispatch<Partial<Settings>>}>({
    settings: {
        exportTargetId: "default",
        targetRestRoot: "",
        downloadFileName: "swipeforfuture.ces.json",
        saveDelay: 5000,
        exportDelay: 5000,
    },
    update: () => {},
});