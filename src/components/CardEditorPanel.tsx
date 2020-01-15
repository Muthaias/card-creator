import React, {useContext} from 'react';
import { Stack, Text, Slider, TextField, Dropdown, Image, Separator, DocumentCard } from 'office-ui-fabric-react';
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
import { ActionDescriptor, ParameterDescriptor, ParameterType, CardDescriptor, ImageDescriptor } from '../Types';

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
    card,
    onChange,
}) => {
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
            <Separator>Description</Separator>
            <Stack tokens={stackTokens} horizontal horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                <Stack tokens={stackTokens} horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                    <Image width="100%" height="400" src="http://placehold.it/400x400"/>
                    <Dropdown label="Image" placeholder="Image Select" options={availableImages.map(i => ({key: i.id, text: i.name}))}/>
                </Stack>
                <Stack tokens={stackTokens} horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                    <Dropdown
                        label="Urgency"
                        placeholder="Action Urgency"
                        options={["High", "Medium", "Low"].map(t => ({key: t, text: t}))}
                    />
                    <Slider label="Weight" min={0} max={100} step={1} defaultValue={1} showValue/>
                    <TextField label="Text" multiline autoAdjustHeight/>
                </Stack>
            </Stack>
            <Separator>Conditions</Separator>
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
            <Separator>Actions</Separator>
            <Stack tokens={stackTokens} horizontal horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                {availableActions.map(action => (
                    <Stack tokens={stackTokens} key={action.id} horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                        <Text>Action: {action.name}</Text>
                        <ValueSection
                            defaultValues={{}}
                            valueItems={availableModifiers}
                            defaultFlags={{}}
                            flagItems={availableFlags}
                            onChange={(...args) => console.log(args)}
                        />
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
}

export const CardEditorPanel = () => {
    const actions = useContext(ActionsContext);
    const parameters = useContext(ParametersContext);
    const images = useContext(ImagesContext);
    const cards = useContext(CardsContext);
    const {cardId} = useContext(CardEditorContext);

    const availableModifiers = parameters.items.filter(p => p.type === ParameterType.Value);
    const availableFlags = parameters.items.filter(p => p.type === ParameterType.Flag);
    return (
        <CardEditorCore 
            availableActions={actions.items}
            availableFlags={availableFlags}
            availableModifiers={availableModifiers}
            availableImages={images.items}
            onChange={c => {
                console.log(c)
                cards.update(c);
            }}
            card={cards.items.find(c => c.id === cardId)}
        />
    )
}