export type Identity = {
    id: string;
}

export type Unidentified<T> = Pick<T, Exclude<keyof T, keyof Identity>>;

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
    type: ParameterType;
    systemParameter?: true;
}

export type CardCondition = {
    weight: number;
    values: Parameters<[number, number]>;
    flags: Parameters<boolean>;
}

export enum CardType {
    Event = "event",
    Action = "action",
}

export type CardDescriptor = NamedIdentity & {
    imageId?: string;
    type: CardType;
    name: string;
    location: string;
    text: string;
    weight: number;
    conditions: CardCondition[];
    actions: ActionData[];
}

export type EventDescriptor = NamedIdentity & {
    weight: number;
    conditions: CardCondition[];
    initialCardId?: string;
}

export type Parameters<T> = {
    [x: string]: T;
}

export type ModifierType = 'add' | 'set' | 'replace'; 

export type ActionData = {
    actionId: string;
    description?: string;
    modifierType: ModifierType;
    values: Parameters<number>;
    flags: Parameters<boolean>;
    nextCardId?: string;
}