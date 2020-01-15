export type Identity = {
    id: string;
    name: string;
}

export type NamedIdentity = Identity & {
    name: string;
}

export type ImageDescriptor = NamedIdentity & {
    src: string;
    tags: string[];
};

export type ActionDescriptor = NamedIdentity & {
}

export enum ParameterType {
    Flag = 'flag',
    Value = 'value',
}

export type ParameterDescriptor = NamedIdentity & {
    type: ParameterType
}

export type CardDescriptor = NamedIdentity & {
    imageId: string;
    conditions: {
        values: Parameters<[number, number]>;
        flags: Parameters<boolean>;
    }
    actions: ActionData[];
}

export type Parameters<T> = {
    [x: string]: T;
}

export type ModifierType = 'add' | 'set' | 'replace'; 

export type ActionData = {
    actionId: string;
    modifierType: ModifierType;
    values: Parameters<number>;
    flags: Parameters<boolean>;
}