import React, { useMemo, useState } from 'react';
import { initializeIcons, Stack, CommandBar, Panel } from 'office-ui-fabric-react';
import { CardEditorPanel } from './components/CardEditorPanel';
import { ParameterEditorPanel } from './components/ParameterEditorPanel';
import { ImagesContext, ParametersContext, CardsContext, CardEditorManager, CardEditorContext } from './Contexts';
import { CardDescriptor, ImageDescriptor, ParameterDescriptor, ParameterType } from './Types'
import { useItemCrud, useManager } from './ItemCrud';

initializeIcons();

function createCardEditorManager(initialCardId: string | null): CardEditorManager & {listener?: (manager: CardEditorManager) => void} {
    return {
        cardId: initialCardId,
        setCard: function (card) {
            this.cardId = card.id;
            if (this.listener) this.listener(this);
        }
    }
}

function updateUrl(params: URLSearchParams) {
    const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + params.toString();
    window.history.pushState({path:newurl},'',newurl);
}

function useNavigation() {
    const [navState, setNavSate] = useState(window.location.search);
    const nav = useMemo(() => {
        const params = new URLSearchParams(navState);
       
        const setParam = (id: string, value: string) => {
            params.set(id, value);
            updateUrl(params);
            setNavSate(params.toString());
        }
        const unsetParam = (id: string) => {
            params.delete(id);
            updateUrl(params);
            setNavSate(params.toString());
        }
        return {
            viewParametersPanel: () => {
                setParam('panel', 'parameters');
            },
            closePanel: () => {
                unsetParam('panel');
            },
            params: params
        }
    }, [navState]);
    return nav;
}

export const App: React.FunctionComponent = () => {
    const images = useItemCrud<ImageDescriptor>(
        [
            "https://images.unsplash.com/photo-1558981420-87aa9dad1c89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=40",
            "https://images.unsplash.com/photo-1579156618335-f6245e05236a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=40",
            "https://images.unsplash.com/photo-1579278420855-26131e470998?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=40"
        ].map(src => ({
            src: src,
            id: src,
            name: src,
            tags: ["Animals", "Cool stuff"],
        }))
    );
    const parameters = useItemCrud<ParameterDescriptor>(
        [
            'Environment',
            'People',
            'Security',
            'Money'
        ].map(name => ({id: name.toLowerCase().replace(/\s+/g, '-'), name: name, type: ParameterType.Value})),
    );
    const cards = useItemCrud<CardDescriptor>([
        {
            id: "initial-card",
            name: "Initial card",
            text: "",
            location: "Close to you",
            conditions: [],
            actions: [],
        }
    ]);
    const cardEditorManager: CardEditorManager = useManager<CardEditorManager>(
        createCardEditorManager(null)
    );
    const nav = useNavigation();

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
                    {
                        key: 'add-image',
                        text: 'Add Image',
                        onClick: () => {
                            images.add({
                                id: 'image-' + Date.now(),
                                name: 'Name: ' + Date.now(),
                                src: "", tags: []
                            });
                        }
                    },
                ]}
                farItems={[
                    {
                        key: 'card-list',
                        text: 'View Card List',
                        onClick: () => {}
                    },
                    {
                        key: 'parameter-list',
                        text: 'View Parameter List',
                        onClick: nav.viewParametersPanel
                    },
                    {
                        key: 'analyze-card-stack',
                        text: 'Analyze Card Stack',
                        onClick: () => {}
                    }
                ]}
            />
            <ParametersContext.Provider value={parameters}>
                <Stack tokens={{padding: 20}} horizontalAlign="center">
                    <Panel
                        headerText="Parameter Editor"
                        isOpen={nav.params.get('panel') === 'parameters'}
                        onDismiss={() => nav.closePanel()}
                        closeButtonAriaLabel="Close"
                        isBlocking={false}
                    >
                        <ParameterEditorPanel />
                    </Panel>
                    <CardEditorContext.Provider value={cardEditorManager}>
                        <CardsContext.Provider value={cards}>
                            <ImagesContext.Provider value={images}>
                                <div style={{background: "#fff", width: "100%", maxWidth: 900, padding: "10px 40px"}}>
                                    <CardEditorPanel />
                                </div>
                            </ImagesContext.Provider>
                        </CardsContext.Provider>
                    </CardEditorContext.Provider>
                </Stack>
            </ParametersContext.Provider>
        </div>
    );
};
