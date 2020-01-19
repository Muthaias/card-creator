import React, { useMemo, useState, useEffect } from 'react';
import { initializeIcons, Stack, CommandBar, Panel } from 'office-ui-fabric-react';
import { CardEditorPanel } from './components/CardEditorPanel';
import { ParameterEditorPanel } from './components/ParameterEditorPanel';
import { CardListPanel } from './components/CardListPanel';
import { ImagesContext, ParametersContext, CardsContext, CardEditorManager, CardEditorContext } from './Contexts';
import { CardDescriptor, ImageDescriptor, ParameterDescriptor, ParameterType, Identity } from './Types'
import { useItemCrud } from './ItemCrud';
import { imageDescriptors } from './data/CardData';

initializeIcons();

function createCardEditorManager(initialCardId: string | null): CardEditorManager & {listener?: (manager: CardEditorManager) => void} {
    return {
        cardId: initialCardId,
        setCard: function (card) {
            this.cardId = card ? card.id : null;
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
            viewParametersPanel: () => setParam('panel', 'parameters'),
            viewCardList: () => setParam('panel', 'cards'),
            editCard: (card: Identity) => setParam('cardId', card.id),
            newCard: () => unsetParam('cardId'),
            closePanel: () => {
                unsetParam('panel');
            },
            params: params,
            cardId: params.get('cardId'),
            panel: params.get('panel'),
        }
    }, [navState]);
    return nav;
}

function getData<T>(id: string): T | null {
    const blob = window.localStorage.getItem(id);
    try {
        return blob && JSON.parse(blob);
    } catch (_) {
        return null;
    }
}

function setData<T>(id: string, data: T) {
    const blob = JSON.stringify(data);
    window.localStorage.setItem(id, blob);
}

export const App: React.FunctionComponent = () => {
    const images = useItemCrud<ImageDescriptor>(
        getData('images') || imageDescriptors,
        (items) => setData('images', items),
    );
    const parameters = useItemCrud<ParameterDescriptor>(
        getData('parameters') || [
            'Environment',
            'People',
            'Security',
            'Money'
        ].map(name => ({id: name.toLowerCase().replace(/\s+/g, '-'), name: name, type: ParameterType.Value, systemParameter: true})),
        (items) => setData('parameters', items)
    );
    const cards = useItemCrud<CardDescriptor>(
        getData('cards') || [],
        (items) => setData('cards', items),
    );
    const nav = useNavigation();
    const cardEditorManager: CardEditorManager = useMemo(() => ({
        cardId: nav.cardId,
        setCard: (card) => card ? nav.editCard(card) : nav.newCard(),
    }), [nav.cardId]);

    const panelId = nav.params.get("panel");
    const panelContent = panelId !== null && {
        parameters: {
            title: "Parameter Editor",
            content: <ParameterEditorPanel />,
        },
        cards: {
            title: "Card List",
            content: <CardListPanel onCardSelected={(c) => nav.editCard(c)}/>
        }
    }[panelId as ('parameters' | 'cards')];

    return (
        <div>
            <CommandBar
                items={[
                    {
                        key: 'new-card',
                        text: 'New Card',
                        onClick: nav.newCard
                    },
                ]}
                farItems={[
                    {
                        key: 'card-list',
                        text: 'View Card List',
                        onClick: nav.viewCardList
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
                <CardsContext.Provider value={cards}>
                    <ImagesContext.Provider value={images}>
                        <Stack tokens={{padding: 20}} horizontalAlign="center">
                            <Panel
                                headerText={panelContent ? panelContent.title : ''}
                                isOpen={!!panelContent}
                                onDismiss={() => nav.closePanel()}
                                closeButtonAriaLabel="Close"
                                isBlocking={false}
                            >
                                {panelContent && panelContent.content}
                            </Panel>
                            <CardEditorContext.Provider value={cardEditorManager}>
                                <div style={{background: "#fff", width: "100%", maxWidth: 900, padding: "10px 40px"}}>
                                    <CardEditorPanel />
                                </div>
                            </CardEditorContext.Provider>
                        </Stack>
                    </ImagesContext.Provider>
                </CardsContext.Provider>
            </ParametersContext.Provider>
        </div>
    );
};
