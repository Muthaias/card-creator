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
    closePanel(): void;
    closeModal(): void;
    params: URLSearchParams;
    route: string | null;
    panel: string | null;
    modal: string | null;
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
            editCard: (card: Identity) => setParam('route', 'card/' + card.id),
            closePanel: () => unsetParam('panel'),
            closeModal: () => unsetParam('modal'),
            params: params,
            route: params.get('route'),
            panel: params.get('panel'),
            modal: params.get('modal')
        };
        return navigation;
    }, [navState]);
    return nav;
}

export function routeMatch<T = JSX.Element>(nav: Navigation, regexp: RegExp, exec: (match: RegExpMatchArray) => T): T | null {
    if (nav.route) {
        const match = regexp.exec(nav.route);
        return match ? exec(match) : null;
    }
    return null;
}

export function routeSwitch<T = JSX.Element>(nav: Navigation, items: {regexp: RegExp, exec: (match: RegExpMatchArray) => T}[]): T | null {
    const route = nav.route;
    if (route !== null) {
        const item = items.find(({regexp, exec}) => regexp.exec(route));
        return item ? routeMatch<T>(nav, item.regexp, item.exec) : null;
    }
    return null;
}