import React, { useContext } from 'react';
import { Text, Slider, Toggle, Separator, IconButton, Dropdown } from '@fluentui/react';
import { EventDescriptor, ParameterDescriptor, CardCondition, ParameterType, CardType, CardDescriptor, Unidentified } from '../Types';
import { ItemDescriptor, LazyItemEditor } from './ItemEditor';
import { Stack } from '@fluentui/react';
import { LazyTextField } from './LazyTextField';
import { stackTokens } from '../Styling';
import { Range } from './Range';
import { ParametersContext, CardsContext, EventsContext } from '../Contexts';
import { createEventUpdater } from '../system/Event';

type Props = {
    availableModifiers: ItemDescriptor[];
    availableFlags: ParameterDescriptor[];
    availableCards: CardDescriptor[];
    event: EventDescriptor;
    onChange: (event: EventDescriptor) => void;
}

export const EventEditorPanelCore: React.FunctionComponent<Props> = ({
    availableModifiers,
    availableFlags,
    availableCards,
    event,
    onChange = () => {}
}) => {
    const {
        updateEvent,
        addCondition,
        removeCondition,
        updateCondition,
    } = createEventUpdater(event, onChange);

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
            <LazyTextField label="Name" value={event.name} styles={{root: {width: "100%"}}} onChange={(_: any, value?: string) => value !== undefined && updateEvent({name: value})}/>
            <Dropdown
                label="Initial Card"
                selectedKey={event.initialCardId || 'none'}
                onChange={(_, __, index) => index !== undefined && updateEvent({initialCardId: availableCards[index - 1] && availableCards[index - 1].id})}
                placeholder="Card Select"
                options={[{key: 'none', text: 'None'}, ...availableCards.map(i => ({key: i.id, text: i.name}))]}
            />
            <Stack horizontal styles={{root: {width: "100%"}}}>
                <Separator styles={{root: {width: "100%"}}}>Conditions</Separator>
                <IconButton
                    iconProps={{iconName: 'Add'}}
                    onClick={addCondition}
                />
            </Stack>
            <Slider label="Probability" value={event.weight} min={0} max={1} step={0.1} onChange={(value) => updateEvent({
                weight: value,
            })}/>
            {event.conditions.length === 0 && <Stack horizontalAlign="center"><Text>No conditions added</Text></Stack>}
            {event.conditions.map((condition: CardCondition, index, conditions) => (
                <Stack horizontal key={index} verticalAlign="center" tokens={stackTokens}>
                    <Stack styles={{root: {width: '100%'}}}>
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
        </Stack>
    );
}

type EventEditorPanelProps = {
    eventId: string;
}

export const EventEditorPanel: React.FunctionComponent<EventEditorPanelProps> = ({eventId}) => {
    const parameters = useContext(ParametersContext);
    const cards = useContext(CardsContext);
    const events = useContext(EventsContext);

    const currentEvent = events.read({id: eventId});

    const availableModifiers = parameters.items().filter(p => p.type === ParameterType.Value);
    const availableFlags = parameters.items().filter(p => p.type === ParameterType.Flag);
    const availableCards = cards.items().filter(c => c.type === CardType.Event);
    return currentEvent === undefined ? (
        <Stack horizontalAlign='center'>
            {eventId ? (
                <Text>Event with event id '{eventId}' could not be found.</Text>
            ) : (
                <Text>No event selected</Text>
            )}
        </Stack>
    ) : (
        <EventEditorPanelCore
            availableFlags={availableFlags}
            availableModifiers={availableModifiers}
            availableCards={availableCards}
            onChange={e => {
                events.update(e);
            }}
            event={currentEvent}
        />
    );
}