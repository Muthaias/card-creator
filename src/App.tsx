import React from 'react';
import { initializeIcons, Stack, CommandBar, BaseButton, Breadcrumb } from 'office-ui-fabric-react';
import { CardEditorPanel } from './components/CardEditorPanel';
import { ParameterEditorPanel } from './components/ParameterEditorPanel';
import { ImagesContext, ParametersContext, RouteManager } from './Contexts';
import { ImageDescriptor, ParameterDescriptor, ParameterType } from './Types'
import { useItemCrud, useManager } from './ItemCrud';

initializeIcons();

function createRouteManager(initialRoute: string[]): RouteManager & {listener?: (manager: RouteManager) => void, setRoute: (route: string[]) => void} {
    return {
        route: initialRoute,
        viewCard: function (card) {
            this.setRoute(["Card", card.id]);
        },
        viewAnalyzeCards: function () {
            this.setRoute(["Cards", "Analyze"]);
        },
        viewParameterList: function () {
            this.setRoute(["Parameters", "View"]);
        },
        viewCardList: function () {
            this.setRoute(["Cards", "View"]);
        },
        viewImageList: function () {
            this.setRoute(["Images", "View"]);
        },
        viewActionList: function () {
            this.setRoute(["Actions", "View"]);
        },
        setRoute: function (route: string[]) {
            this.route = route;
            if (this.listener) this.listener(this);
        }
    }
}

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
    const parameters = useItemCrud<ParameterDescriptor>(
        [
            'Environment',
            'People',
            'Security',
            'Money'
        ].map(name => ({id: name.toLowerCase().replace(/\s+/g, '-'), name: name, type: ParameterType.Value})),
    );
    const routeManager: RouteManager = useManager<RouteManager>(
        createRouteManager(["Card", "Test"])
    );
    const routeItems = routeManager.route.map(rid => ({
        key: rid,
        text: rid,
    }));
    
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
                        onClick: () => routeManager.viewCardList()
                    },
                    {
                        key: 'parameter-list',
                        text: 'View Parameter List',
                        onClick: () => routeManager.viewParameterList()
                    },
                    {
                        key: 'analyze-card-stack',
                        text: 'Analyze Card Stack',
                        onClick: () => routeManager.viewAnalyzeCards()
                    }
                ]}
            />
            <Stack tokens={{padding: 20}} horizontalAlign="center">
                <ParametersContext.Provider value={parameters}>
                    <div style={{background: "#fff", width: "100%", maxWidth: 900, padding: "10px 40px"}}>
                        <ParameterEditorPanel />
                    </div>
                </ParametersContext.Provider>
                <ImagesContext.Provider value={images}>
                    <div style={{background: "#fff", width: "100%", maxWidth: 900, padding: "10px 40px"}}>
                        <Breadcrumb items={routeItems}/>
                        <CardEditorPanel />
                    </div>
                </ImagesContext.Provider>
            </Stack>
        </div>
    );
};
