import React, {useState, useEffect} from 'react';
import { initializeIcons, Stack, CommandBar, BaseButton } from 'office-ui-fabric-react';
import { CardEditorPanel } from './components/CardEditorPanel';
import { ImagesContext } from './Contexts';
import { ImageDescriptor } from './Types'
import { useItemCrud } from './ItemCrud';

initializeIcons();

export const App: React.FunctionComponent = () => {
    const images = useItemCrud<ImageDescriptor>(
        [
            "Monkey",
            "Donkey",
            "Ghost"
        ].map(src => ({
            src: src,
            id: src,
            name: src,
            tags: ["Animals", "Cool stuff"],
        }))
    );
    
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
            <BaseButton onClick={() => {images.add({id: 'image-' + Date.now(), name: 'Name: ' + Date.now(), src: "", tags: []})}}>Add Image</BaseButton>
            <Stack tokens={{padding: 20}} horizontalAlign="center">
                <ImagesContext.Provider value={images}>
                    <div style={{background: "#fff", width: "100%", maxWidth: 900, padding: 40}}>
                        <CardEditorPanel />
                    </div>
                </ImagesContext.Provider>
            </Stack>
        </div>
    );
};
