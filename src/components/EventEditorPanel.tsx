import React, { useContext } from 'react';
import { Text, Slider, Toggle, Separator, IconButton, Dropdown } from 'office-ui-fabric-react';
import { EventDescriptor, ParameterDescriptor, CardCondition, ParameterType, CardType, CardDescriptor } from '../Types';
import { ItemDescriptor, LazyItemEditor } from './ItemEditor';
import { Stack } from 'office-ui-fabric-react';
import { LazyTextField } from './LazyTextField';
import { stackTokens } from '../Styling';
import { Range } from './Range';
import { ActionsContext, ParametersContext, CardsContext, EventsContext } from '../Contexts';

type Props = {
    availableModifiers: ItemDescriptor[];
    availableFlags: ParameterDescriptor[];
    availableCards: CardDescriptor[];
    event?: EventDescriptor;
    onChange: (event: EventDescriptor) => void;
}

export const EventEditorPanelCore: React.FunctionComponent<Props> = ({
    availableModifiers,
    availableFlags,
    availableCards,
    event = {
        id: 'event-' + Date.now(),
        name: '',
        conditions: [],
    },
    onChange = () => {}
}) => {
    const updateEvent = (info: Partial<EventDescriptor>) => {
        onChange(Object.assign({}, event, info));
    }

    const addCondition = () => {
        updateEvent({conditions: [
            ...event.conditions, {
                weight: 0,
                values: {},
                flags: {}
            }
        ]});
    };

    const removeCondition = (index: number) => {
        const conditions = [...event.conditions];
        conditions.splice(index);
        updateEvent({
            conditions: conditions,
        });
    }

    const updateCondition = (index: number, newCondition: Partial<CardCondition>) => {
        updateEvent({
            conditions: event.conditions.map((c, i) => i === index ? Object.assign({}, c, newCondition) : c),
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
            {event.conditions.length === 0 && <Stack horizontalAlign="center"><Text>No conditions added</Text></Stack>}
            {event.conditions.map((condition: CardCondition, index, conditions) => (
                <Stack horizontal key={index} verticalAlign="center" tokens={stackTokens}>
                    <Stack styles={{root: {width: '100%'}}}>
                        <Slider label="Weight" value={condition.weight} onChange={(value) => updateCondition(index, {
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

    const currentEvent = events.get({id: eventId});

    const availableModifiers = parameters.items().filter(p => p.type === ParameterType.Value);
    const availableFlags = parameters.items().filter(p => p.type === ParameterType.Flag);
    const availableCards = cards.items().filter(c => c.type === CardType.Event);
    return eventId && currentEvent === undefined ? (
        <Stack horizontalAlign='center'>
            <Text>Event with event id '{eventId}' could not be found.</Text>
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