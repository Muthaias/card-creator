import { CardCondition, CardDescriptor } from "../Types";

export const addCondition = (part: Pick<CardDescriptor, 'conditions'>) => {
    return ({
        conditions: [
            ...part.conditions,
            {
                weight: 0,
                values: {},
                flags: {}
            }
        ]
    });
};

export const removeCondition = (part: Pick<CardDescriptor, 'conditions'>, index: number) => {
    const conditions = [...part.conditions];
    conditions.splice(index, 1);
    return ({
        conditions: conditions,
    });
}

export const updateCondition = (part: Pick<CardDescriptor, 'conditions'>, index: number, newCondition: Partial<CardCondition>) => {
    return ({
        conditions: part.conditions.map((c, i) => i === index ? Object.assign({}, c, newCondition) : c),
    });
}