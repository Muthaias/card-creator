import { useState, useEffect, useMemo } from 'react';
import { Identity, Unidentified } from './Types';

export type CrudContext<T> = {
    items: () => T[];
    read: (item: Identity) => T | undefined;
    update: (item: Identity & Partial<T>) => void;
    create: (item: Unidentified<T>) => void;
    delete: (item: Identity) => void;
    load: (items: T[]) => void;
}

export function createInitialCrudContext<T>(items: T[]): CrudContext<T> {
    return {
        items: () => items,
        read: (item: Identity) => undefined,
        update: () => {},
        create: () => {},
        delete: () => {},
        load: () => {},
    };
}

function crudItemMap<T extends Identity>(items: T[]) {
    return items.reduce((map, item: T) => {map.set(item.id, item); return map}, new Map<string, T>());
}

export function createItemCrud<T extends Identity> (items: T[], idGenerator: () => string): CrudContext<T> {
    const itemCrud: CrudContext<T> & {
        itemMap: Map<string, T>;
    } = {
        itemMap: crudItemMap(items),
        items: function () {
            return Array.from(this.itemMap.values());
        },
        update: function (item) {
            const currentItem = this.itemMap.get(item.id);
            Object.assign(currentItem, item);
        },
        read: function(item: Identity) {
            return this.itemMap.get(item.id);
        },
        create: function (item) {
            const newItem: T = Object.assign({}, item as T, {id: idGenerator()});
            this.itemMap.set(newItem.id, newItem);
        },
        delete: function (item) {
            this.itemMap.delete(item.id)
        },
        load: function (items: T[]) {
            this.itemMap = crudItemMap(items);
        },
    }

    return itemCrud;
}

export function useItemCrud<T extends Identity>(initialItems: () => T[], itemListener?: (items: CrudContext<T>) => void, itemId: string = 'item'): CrudContext<T> {
    let itemCount = 0;
    const [items, setItems] = useState(
        () => createItemCrud<T>(initialItems(), () => [itemId, Date.now(), itemCount++].join('-'))
    );
    useEffect(() => {
        if (itemListener) {
            itemListener(items);
        }
    }, [items, itemListener]);
    
    return useMemo(() => {
        const updateItems = () => {
            setItems(Object.assign({}, items));
        };
        return {
            items: () => items.items(),
            read: (item) => items.read(item),
            update: (item) => {items.update(item); updateItems();},
            create: (item) => {items.create(item); updateItems();},
            delete: (item) => {items.delete(item); updateItems();},
            load: (item) => {items.load(item); updateItems();}
        };
    }, [items]);
}

export function useManager<M>(initialManager: M & {listener?: (manager: M) => void}): M & {listener?: (manager: M) => void} {
    const [manager, setManager] = useState(
        initialManager
    );
    useEffect(() => {
        if (!manager.listener) {
            manager.listener = function () {
                setManager(Object.assign({}, this));
            }
            setManager(Object.assign({}, manager));
        }
    }, [manager.listener]);
    return manager;
}