import React, {useContext} from 'react';
import { Stack, Text, Slider, TextField, Dropdown, Image, Separator, IconButton } from 'office-ui-fabric-react';
import { ValueSection } from './ValueSection';
import { ItemEditor, ItemDescriptor } from './ItemEditor';
import { Range } from './Range';
import { stackTokens } from '../Styling';
import {
    ActionsContext,
    ParametersContext,
    CardEditorContext,
    ImagesContext,
    CardsContext,
} from '../Contexts';
import { ActionDescriptor, ActionData, ParameterDescriptor, ParameterType, CardDescriptor, CardCondition, ImageDescriptor } from '../Types';

type Props = {
    availableModifiers: ItemDescriptor[];
    availableFlags: ParameterDescriptor[];
    availableActions: ActionDescriptor[];
    availableImages: ImageDescriptor[];
    card?: CardDescriptor,
    onChange?: (card: CardDescriptor) => void;
}

export const CardEditorCore: React.FunctionComponent<Props> = ({
    availableModifiers,
    availableFlags,
    availableActions,
    availableImages,
    ...props
}) => {
    const card: CardDescriptor = props.card === undefined ? {
        id: "card-" + Date.now(),
        name: "",
        location: "",
        text: "",
        conditions: [],
        actions: [],
    } : props.card;
    const currentImage = availableImages.find(i => i.id === card.imageId);

    const onChange: (card: CardDescriptor) => void = props.onChange === undefined ? (
        () => {}
    ) : props.onChange;

    const updateCard = (info: Partial<CardDescriptor>) => {
        onChange(Object.assign({}, card, info));
    }

    const addCondition = () => {
        updateCard({conditions: [
            ...card.conditions, {
                weight: 0,
                values: {},
                flags: {}
            }
        ]});
    };

    const updateCondition = (index: number, newCondition: CardCondition) => {
        updateCard({
            conditions: card.conditions.map((c, i) => i === index ? newCondition : c),
        });
    }

    const updateAction = (actionData: ActionData) => {
        updateCard({
            actions: [
                ...card.actions.filter(a => a.actionId === actionData.actionId),
                actionData,
            ]
        });
    }
    return (
        <Stack
            tokens={stackTokens}
            horizontalAlign="stretch"
            verticalAlign="start"
            verticalFill={true}
            styles={{
                root: {
                    color: '#605e5c',
                    maxWidth: 960,
                    width: '100%',
                }
            }}
        >
            <TextField label="Name" value={card.name} styles={{root: {width: "100%"}}} onChange={(_, value) => value !== undefined && updateCard({name: value})}/>
            <Separator>Description</Separator>
            <Stack tokens={stackTokens} horizontal horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                <Stack tokens={stackTokens} horizontalAlign="stretch" styles={{root: {width: "50%"}}}>
                    <Image width="100%" height="400" src={currentImage === undefined ? "http://placehold.it/400x400" : currentImage.src}/>
                    <Dropdown
                        label="Image"
                        selectedKey={card.imageId}
                        onChange={(_, __, index) => index !== undefined && updateCard({imageId: availableImages[index].id})}
                        placeholder="Image Select"
                        options={availableImages.map(i => ({key: i.id, text: i.name}))}
                    />
                </Stack>
                <Stack tokens={stackTokens} horizontalAlign="stretch" styles={{root: {width: "50%"}}}>
                    <Dropdown
                        label="Urgency"
                        placeholder="Action Urgency"
                        options={["High", "Medium", "Low"].map(t => ({key: t, text: t}))}
                    />
                    <TextField label="Location" value={card.location} onChange={(_, value) => value !== undefined && updateCard({location: value})}/>
                    <TextField
                        label="Text"
                        value={card.text}
                        multiline
                        autoAdjustHeight
                        onChange={(_, value) => value !== undefined && updateCard({text: value})}
                    />
                </Stack>
            </Stack>
            <Stack horizontal styles={{root: {width: "100%"}}}>
                <Separator styles={{root: {width: "100%"}}}>Conditions</Separator>
                <IconButton
                    iconProps={{iconName: 'Add'}}
                    onClick={addCondition}
                />
            </Stack>
            {card.conditions.length === 0 && <Stack horizontalAlign="center"><Text>No conditions added</Text></Stack>}
            {card.conditions.map((condition, index) => (
                <Stack key={index}>
                    <Slider label="Weight" value={condition.weight} onChange={(value) => updateCondition(index, {
                        weight: value,
                        values: condition.values,
                        flags: condition.flags,
                    })}/>
                    <ItemEditor<[number, number]>
                        items={availableModifiers}
                        label={"Select Conditions"}
                        defaultItemValue={[0, 100]}
                        onRender={(item, value, onValueChange) => (
                            <Range
                                label={item.name}
                                min={0}
                                max={100}
                                value={value}
                                onChange={(v: [number, number]) => onValueChange(item, v)}
                                styles={{root: {width: '100%'}}}
                            />
                        )}
                    />
                </Stack>
            ))}
            <Separator>Actions</Separator>
            <Stack tokens={stackTokens} horizontal horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                {availableActions.map(action => {
                    const actionData: ActionData = card.actions.find(a => action.id === a.actionId) || {
                        actionId: action.id,
                        values: {},
                        flags: {},
                        modifierType: 'add',
                    }
                    return (
                        <Stack tokens={stackTokens} key={action.id} horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                            <Text>Action: {action.name}</Text>
                            <ValueSection
                                values={actionData.values}
                                valueItems={availableModifiers}
                                flags={actionData.flags}
                                flagItems={availableFlags}
                                modifierType={actionData.modifierType}
                                onChange={(description, values, flags, modifierType) => updateAction({
                                    actionId: action.id,
                                    description: description,
                                    values: values,
                                    flags: flags,
                                    modifierType: modifierType
                                })}
                            />
                        </Stack>
                    );
                })}
            </Stack>
        </Stack>
    );
}

export const CardEditorPanel = () => {
    const actions = useContext(ActionsContext);
    const parameters = useContext(ParametersContext);
    const images = useContext(ImagesContext);
    const cards = useContext(CardsContext);
    const cardEditorManager = useContext(CardEditorContext);
    const {cardId} = cardEditorManager;

    const availableModifiers = parameters.items.filter(p => p.type === ParameterType.Value);
    const availableFlags = parameters.items.filter(p => p.type === ParameterType.Flag);
    const currentCard = cards.items.find(c => c.id === cardId);
    return (
        <CardEditorCore 
            availableActions={actions.items}
            availableFlags={availableFlags}
            availableModifiers={availableModifiers}
            availableImages={images.items}
            onChange={c => {
                if (currentCard) {
                    cards.update(c);
                    console.log("update:", cardId, c);
                } else if (cardId === null) {
                    cardEditorManager.setCard(c);
                    cards.add(c);
                    console.log("add:", cardId, c);
                }
            }}
            card={currentCard}
        />
    )
}