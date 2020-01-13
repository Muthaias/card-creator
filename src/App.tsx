import React, { useState, useReducer, useEffect } from 'react';
import { initializeIcons, Stack, Text, Slider, Link, FontWeights, IconButton, DefaultButton, TextField, Dropdown, Panel, CommandBar } from 'office-ui-fabric-react';
import { ValueSection } from './components/ValueSection';
import { ItemEditor } from './components/ItemEditor';
import { Range } from './components/Range';

const boldStyle = {
    root: { fontWeight: FontWeights.semibold }
};
const stackTokens = {
    childrenGap: 5,
};

initializeIcons();

export const App: React.FunctionComponent = () => {
    const availableActions = [
        "left",
        "right",
    ]
    const availableModifiers = [
        "environment",
        "people",
        "security",
        "money"
    ]
    const availableFlags = [
        "introduction-complete",
    ]
    return (
        <div>
            <CommandBar
                items={[
                    {
                        key: 'save-card',
                        text: 'Save Card',
                        onClick: () => console.log('Save Card')
                    },
                    {
                        key: 'new-card',
                        text: 'New Card',
                        onClick: () => console.log('New Card')
                    },
                ]}
                farItems={[
                    {
                        key: 'card-list',
                        text: 'View Card List',
                        onClick: () => console.log('View Card List')
                    },
                    {
                        key: 'modifier-list',
                        text: 'View Modifier List',
                        onClick: () => console.log('View Modifier List')
                    },
                    {
                        key: 'flag-list',
                        text: 'View Flag List',
                        onClick: () => console.log('View Flag List')
                    },
                    {
                        key: 'analyze-card-stack',
                        text: 'Analyze Card Stack',
                        onClick: () => console.log('Analyze Card Stack')
                    }
                ]}
            />
            <Stack tokens={{padding: 20}} horizontalAlign="center">
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
                    <Text>Description</Text>
                    <Dropdown
                        label="Urgency"
                        placeholder="Action urgency"
                        options={["High", "Medium", "Low"].map(t => ({key: t, text: t}))}
                    />
                    <TextField label="Image"/>
                    <Slider label="Weight" min={0} max={100} step={1} defaultValue={1} showValue/>
                    <TextField label="Text" multiline autoAdjustHeight/>
                    <ItemEditor<[number, number]>
                        items={availableModifiers.map(mid => ({id: mid, name: mid}))}
                        label={"Select Value"}
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
                    <Stack tokens={stackTokens} horizontal horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                        {availableActions.map(actionId => (
                            <Stack tokens={stackTokens} key={actionId} horizontalAlign="stretch" styles={{root: {width: "100%"}}}>
                                <Text>Action: {actionId}</Text>
                                <ValueSection
                                    defaultValues={{}}
                                    valueItems={availableModifiers.map(mid => ({id: mid, name: mid}))}
                                    defaultFlags={{}}
                                    flagItems={availableFlags.map(fid => ({id: fid, name: fid}))}
                                    onChange={(...args) => console.log(args)}
                                />
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        </div>
    );
};
