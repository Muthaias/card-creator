import { EventDescriptor, CardCondition } from "../Types";
import { updateCondition, removeCondition, addCondition } from "./Conditions";

export const updateEvent = (event: EventDescriptor, info: Partial<EventDescriptor>) => Object.assign({}, event, info);

export const createEventUpdater = (event: EventDescriptor, onUpdate: (event: EventDescriptor) => void) => {
    const updateEventInternal = (info: Partial<EventDescriptor>) => onUpdate(updateEvent(event, info));
    return {
        updateEvent: updateEventInternal,
        addCondition: () => updateEventInternal(addCondition(event)),
        updateCondition: (index: number, newCondition: Partial<CardCondition>) => updateEventInternal(updateCondition(event, index, newCondition)),
        removeCondition: (index: number) => updateEventInternal(removeCondition(event, index)),
    };
}