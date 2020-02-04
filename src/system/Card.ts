import { CardDescriptor, CardCondition, ActionData } from "../Types";
import { addCondition, updateCondition, removeCondition } from "./Conditions";
import { updateAction } from "./Actions";

export const updateCard = (card: CardDescriptor, info: Partial<CardDescriptor>) => Object.assign({}, card, info);

export const createCardUpdater = (card: CardDescriptor, onUpdate: (card: CardDescriptor) => void) => {
    const updateCardInternal = (info: Partial<CardDescriptor>) => onUpdate(updateCard(card, info));
    return {
        updateCard: updateCardInternal,
        addCondition: () => updateCardInternal(addCondition(card)),
        updateCondition: (index: number, newCondition: Partial<CardCondition>) => updateCardInternal(updateCondition(card, index, newCondition)),
        removeCondition: (index: number) => updateCardInternal(removeCondition(card, index)),
        updateAction: (actionData: ActionData) => updateCardInternal(updateAction(card, actionData)),
    };
}