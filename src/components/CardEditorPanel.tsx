import React, {useContext} from 'react';
import { Stack, Text, Slider, Dropdown, Image, Separator, Toggle, IconButton } from 'office-ui-fabric-react';
import { LazyValueSection } from './ValueSection';
import { LazyItemEditor, ItemDescriptor } from './ItemEditor';
import { Range } from './Range';
import { stackTokens } from '../Styling';
import {
    ActionsContext,
    ParametersContext,
    ImagesContext,
    CardsContext,
} from '../Contexts';
import { ActionDescriptor, ActionData, ParameterDescriptor, ParameterType, CardDescriptor, CardCondition, ImageDescriptor, CardType } from '../Types';
import { LazyTextField } from './LazyTextField';

type Props = {
    availableModifiers: ItemDescriptor[];
    availableFlags: ParameterDescriptor[];
    availableActions: ActionDescriptor[];
    availableImages: ImageDescriptor[];
    availableCards: CardDescriptor[];
    card?: CardDescriptor;
    onChange?: (card: CardDescriptor) => void;
}

export const CardEditorCore: React.FunctionComponent<Props> = ({
    availableModifiers,
    availableFlags,
    availableActions,
    availableImages,
    availableCards,
    ...props
}) => {
    const card: CardDescriptor = props.card === undefined ? {
        id: "card-" + Date.now(),
        type: CardType.Action,
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

    const updateCondition = (index: number, newCondition: Partial<CardCondition>) => {
        updateCard({
            conditions: card.conditions.map((c, i) => i === index ? Object.assign({}, c, newCondition) : c),
        });
    }

    const removeCondition = (index: number) => {
        const conditions = [...card.conditions];
        conditions.splice(index);
        updateCard({
            conditions: conditions,
        });
    }

    const updateAction = (actionData: ActionData) => {
        updateCard({
            actions: [
                ...card.actions.filter(a => a.actionId !== actionData.actionId),
                actionData,
            ]
        });
    }
    const cardTypeMap: [string, CardType][] = [
        ['Action', CardType.Action],
        ['Event', CardType.Event],
    ];
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
            <LazyTextField label="Name" value={card.name} styles={{root: {width: "100%"}}} onChange={(_: any, value?: string) => value !== undefined && updateCard({name: value})}/>
            <Separator>Description</Separator>
            <Stack tokens={stackTokens} horizontal horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                <Stack tokens={stackTokens} horizontalAlign="stretch" styles={{root: {width: "50%"}}}>
                    <Image width="100%" height="400" src={currentImage === undefined ? "http://placehold.it/400x400" : currentImage.src}/>
                    <Dropdown
                        label="Image"
                        selectedKey={card.imageId || null}
                        onChange={(_, __, index) => index !== undefined && updateCard({imageId: availableImages[index].id})}
                        placeholder="Image Select"
                        options={availableImages.map(i => ({key: i.id, text: i.name}))}
                    />
                </Stack>
                <Stack tokens={stackTokens} horizontalAlign="stretch" styles={{root: {width: "50%"}}}>
                    <Dropdown
                        label="Type"
                        placeholder="Card Type"
                        selectedKey={cardTypeMap.find(([_, type]) => type === (card.type || CardType.Action))![0]}
                        onChange={(_, option) => option && updateCard({type: cardTypeMap.find(([key, _]) => option.key === key)![1]})}
                        options={cardTypeMap.map(([key, _]) => ({key: key, text: key}))}
                    />
                    <LazyTextField label="Location" value={card.location} onChange={(_: any, value?: string) => value !== undefined && updateCard({location: value})}/>
                    <LazyTextField
                        label="Text"
                        value={card.text}
                        multiline
                        autoAdjustHeight
                        onChange={(_: any, value?: string) => value !== undefined && updateCard({text: value})}
                    />
                </Stack>
            </Stack>
            {card.type !== CardType.Event && (
                <Stack horizontal styles={{root: {width: "100%"}}}>
                    <Separator styles={{root: {width: "100%"}}}>Conditions</Separator>
                    <IconButton
                        iconProps={{iconName: 'Add'}}
                        onClick={addCondition}
                    />
                </Stack>
            )}
            {card.type !== CardType.Event && card.conditions.length === 0 && <Stack horizontalAlign="center"><Text>No conditions added</Text></Stack>}
            {card.type !== CardType.Event && card.conditions.map((condition: CardCondition, index, conditions) => (
                <Stack horizontal key={index} verticalAlign="center" tokens={stackTokens}>
                    <Stack styles={{root: {width: '100%'}}}>
                        <Slider label="Weight" min={0} max={1} step={0.1} value={condition.weight} onChange={(value) => updateCondition(index, {
                            weight: value,
                        })}/>
                        <LazyItemEditor<[number, number]>
                            items={availableModifiers}
                            values={condition.values}
                            label={"Select Values"}
                            defaultItemValue={[0, 100]}
                            onChange={(values) => updateCondition(index, {
                                values: values,
                            })}
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
                        <LazyItemEditor<boolean>
                            items={availableFlags}
                            values={condition.flags}
                            label={"Select Flags"}
                            defaultItemValue={true}
                            onChange={(flags) => updateCondition(index, {
                                flags: flags,
                            })}
                            onRender={(item, value, onValueChange) => (
                                <Toggle
                                    key={item.id}
                                    onChange={(_, v) => {
                                        if (v !== undefined) onValueChange(item, v);
                                    }}
                                    label={item.name}
                                    checked={value}
                                    styles={{root: {width: '100%'}}}
                                />
                            )}
                        />
                        {index !== conditions.length - 1 && <Separator />}
                    </Stack>
                    <Separator vertical/>
                    <IconButton
                        iconProps={{iconName: 'Trash'}}
                        onClick={() => removeCondition(index)}
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
                            <LazyValueSection
                                description={actionData.description || ''}
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
                            {card.type === CardType.Event && (
                                <Dropdown
                                    label="Next Card"
                                    selectedKey={actionData.nextCardId || 'none'}
                                    onChange={(_, __, index) => index !== undefined && updateAction(Object.assign({}, actionData, {nextCardId: availableCards[index - 1] && availableCards[index - 1].id}))}
                                    placeholder="Card Select"
                                    options={[{key: 'none', text: 'None'}, ...availableCards.map(i => ({key: i.id, text: i.name}))]}
                                />
                            )}
                        </Stack>
                    );
                })}
            </Stack>
        </Stack>
    );
}

export const CardEditorPanel: React.FunctionComponent<{cardId: string}> = ({cardId}) => {
    const actions = useContext(ActionsContext);
    const parameters = useContext(ParametersContext);
    const images = useContext(ImagesContext);
    const cards = useContext(CardsContext);

    const availableModifiers = parameters.items().filter(p => p.type === ParameterType.Value);
    const availableFlags = parameters.items().filter(p => p.type === ParameterType.Flag);
    const currentCard = cards.items().find(c => c.id === cardId);
    const availableCards = cards.items().filter(c => c.type === CardType.Event && c.id !== cardId);
    return cardId && currentCard === undefined ? (
        <Stack horizontalAlign='center'>
            <Text>Card with card id '{cardId}' could not be found.</Text>
        </Stack>
    ) : (
        <CardEditorCore 
            availableActions={actions.items()}
            availableFlags={availableFlags}
            availableModifiers={availableModifiers}
            availableImages={images.items()}
            availableCards={availableCards}
            onChange={c => {
                cards.update(c);
            }}
            card={currentCard}
        />
    );
}