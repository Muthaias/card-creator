import React, { useMemo } from 'react';
import { Panel } from 'office-ui-fabric-react';

import { ParameterEditorPanel } from './ParameterEditorPanel';
import { CardListPanel } from './CardListPanel';
import { ImageListPanel } from './ImageListPanel';
import { Navigation } from '../../Navigation';
import { EventListPanel } from './EventListPanel';
import { SettingsPanel } from './SettingsPanel';

type Props = {
    nav: Navigation;
};

export const PanelControl: React.FunctionComponent<Props> = ({nav}) => {
    const panelId = nav.panel;
    const panelContentMap = useMemo<{[x: string]: {title: string, content: JSX.Element}}>(() => ({
        parameters: {
            title: 'Parameter Editor',
            content: <ParameterEditorPanel />,
        },
        cards: {
            title: 'Card List',
            content: (
                <CardListPanel
                    onCardSelected={(c) => nav.editCard(c)}
                    onAddCard={() => nav.addCard()}
                />
            )
        },
        images: {
            title: 'Image list',
            content: (
                <ImageListPanel
                    onImageSelected={(i) => console.log(i)}
                    onAddImage={() => nav.addImage()}
                />
            )
        },
        events: {
            title: 'Event list',
            content: (
                <EventListPanel
                    onAddEvent={() => nav.addEvent()}
                    onEventSelected={(e) => nav.editEvent(e)}
                />
            )
        },
        settings: {
            title: 'Settings',
            content: (
                <SettingsPanel />
            )
        }
    }), [nav]);
    const panelContent = panelContentMap[panelId as ('parameters' | 'cards' | 'images' | 'events' | 'settings')];
    return (
        <Panel
            headerText={panelContent ? panelContent.title : ''}
            isOpen={!!panelContent}
            onDismiss={() => nav.closePanel()}
            closeButtonAriaLabel='Close'
            isBlocking={false}
        >
            {panelContent && panelContent.content}
        </Panel>
    );
}