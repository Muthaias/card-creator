import { useMemo, useState } from 'react';
import { Identity } from './Types';

function updateUrl(params: URLSearchParams) {
    const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + params.toString();
    window.history.pushState({ path: newurl }, '', newurl);
}

export type Navigation = {
    exportGameWorld(): void;
    viewParametersPanel(): void;
    viewImagesPanel(): void;
    viewCardsPanel(): void;
    addImage(): void;
    addCard(): void;
    editCard(card: Identity): void;
    newCard(): void;
    closePanel(): void;
    closeModal(): void;
    params: URLSearchParams;
    cardId: string | null;
    panel: string | null;
}

export function useNavigation(): Navigation {
    const [navState, setNavSate] = useState(window.location.search);
    const nav = useMemo<Navigation>(() => {
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
        const navigation: Navigation = {
            exportGameWorld: () => setParam('modal', 'export_game_world'),
            viewParametersPanel: () => setParam('panel', 'parameters'),
            viewImagesPanel: () => setParam('panel', 'images'),
            viewCardsPanel: () => setParam('panel', 'cards'),
            addImage: () => setParam('modal', 'add_image'),
            addCard: () => setParam('modal', 'add_card'),
            editCard: (card: Identity) => setParam('cardId', card.id),
            newCard: () => unsetParam('cardId'),
            closePanel: () => unsetParam('panel'),
            closeModal: () => unsetParam('modal'),
            params: params,
            cardId: params.get('cardId'),
            panel: params.get('panel'),
        };
        return navigation;
    }, [navState]);
    return nav;
}