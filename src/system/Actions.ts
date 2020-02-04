import { CardDescriptor, ActionData } from "../Types";

export const updateAction = (part: Pick<CardDescriptor, 'actions'>, actionData: ActionData) => {
    const actionExists = part.actions.some(action => action.actionId === actionData.actionId);
    return ({
        actions: actionExists ? (
            part.actions.map((a => a.actionId === actionData.actionId ? Object.assign({}, a, actionData) : a))
        ) : [
            ...part.actions,
            actionData
        ]
    });
};
