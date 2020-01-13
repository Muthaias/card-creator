import React from 'react';
import { initializeIcons, Stack, CommandBar } from 'office-ui-fabric-react';
import { ItemDescriptor } from './components/ItemEditor';
import { CardEditorPanel } from './components/CardEditorPanel';

initializeIcons();

const stringToItemDescriptor = (value: string): ItemDescriptor => ({
    name: value,
    id: value.toLowerCase().replace(/\s+/g, '-')
})

export const App: React.FunctionComponent = () => {
    const availableActions: ItemDescriptor[] = [
        "Left",
        "Right",
    ].map(stringToItemDescriptor);
    const availableModifiers: ItemDescriptor[] = [
        "Environment",
        "People",
        "Security",
        "Money"
    ].map(stringToItemDescriptor);
    const availableFlags: ItemDescriptor[] = [
        "Introduction Complete",
    ].map(stringToItemDescriptor);
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
                <div style={{background: "#fff", width: "100%", maxWidth: 900, padding: 40}}>
                <CardEditorPanel
                    availableActions={availableActions}
                    availableFlags={availableFlags}
                    availableModifiers={availableModifiers}
                />
                </div>
            </Stack>
        </div>
    );
};
