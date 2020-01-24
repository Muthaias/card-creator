import React from 'react';
import { initializeIcons, Stack, CommandBar, Layer, Text, Separator, Link } from 'office-ui-fabric-react';

import { CardEditorPanel } from './components/CardEditorPanel';
import { PanelControl } from './components/panels/PanelControl';
import { ImagesContext, ParametersContext, CardsContext } from './Contexts';
import { CardDescriptor, ImageDescriptor, ParameterDescriptor, ParameterType } from './Types'
import { useItemCrud } from './ItemCrud';
import { useNavigation, routeMatch } from './Navigation';
import { imageDescriptors } from './data/CardData';
import { ModalControl } from './components/modals/ModalControl';
import { ParameterEditorPanel } from './components/panels/ParameterEditorPanel';

initializeIcons();

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
        (crud) => setData('images', crud.items()),
    );
    const parameters = useItemCrud<ParameterDescriptor>(
        getData('parameters') || [
            'Environment',
            'People',
            'Security',
            'Money'
        ].map(name => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name: name, type: ParameterType.Value, systemParameter: true })),
        (crud) => setData('parameters', crud.items())
    );
    const cards = useItemCrud<CardDescriptor>(
        getData('cards') || [],
        (crud) => setData('cards', crud.items()),
    );
    const nav = useNavigation();

    return (
        <div>
            <Layer>
                <CommandBar
                    styles={{
                        root: {
                            boxShadow: "0 2px 2px rgba(0, 0, 0, 0.2)"
                        }
                    }}
                    items={[
                        {
                            key: 'advanced',
                            text: 'Advanced',
                            onClick: () => { }
                        },
                        {
                            key: '',
                            text: 'Export',
                            onClick: nav.exportGameWorld
                        }
                    ]}
                    farItems={[
                        {
                            key: 'image-list',
                            text: 'View Image List',
                            onClick: nav.viewImagesPanel
                        },
                        {
                            key: 'card-list',
                            text: 'View Card List',
                            onClick: nav.viewCardsPanel
                        },
                        {
                            key: 'parameter-list',
                            text: 'View Parameter List',
                            onClick: nav.viewParametersPanel
                        }
                    ]}
                />
            </Layer>
            <ParametersContext.Provider value={parameters}>
                <CardsContext.Provider value={cards}>
                    <ImagesContext.Provider value={images}>
                        <Stack tokens={{ padding: 20 }} horizontalAlign='center'>
                            <PanelControl nav={nav}/>
                            <div style={{ width: '100%', maxWidth: 900, padding: '10px 40px' }}>
                                {(
                                    routeMatch(nav, /^card\/(.*)/, ([_, cardId]) => (
                                        <CardEditorPanel cardId={cardId}/>
                                    ))
                                ) || (
                                    routeMatch(nav, /^parameters/, () => (
                                        <ParameterEditorPanel />
                                    ))
                                ) || (
                                    <Stack>
                                        <Separator>Swipe For Future: Card Creator</Separator>
                                        <Text>Welcome to the card creator for <Link href='https://swipeforfuture.com'>swipeforfuture.com</Link></Text>
                                        <Separator>Contribute</Separator>
                                        <Text>Fork us on <Link href='https://github.com/Muthaias/card-creator'>Github</Link> or add bug reports or feature requests. </Text>
                                    </Stack>
                                )}
                            </div>
                        </Stack>
                        <ModalControl nav={nav} setData={setData}/>
                    </ImagesContext.Provider>
                </CardsContext.Provider>
            </ParametersContext.Provider>
        </div>
    );
};
