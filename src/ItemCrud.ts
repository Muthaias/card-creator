import { useState, useEffect } from 'react';
import { Identity } from './Types';

export type CrudContext<T> = {
    items: () => T[];
    get: (item: Identity) => T | undefined;
    update: (item: Identity & Partial<T>) => void;
    create: (item: T) => void;
    delete: (item: Identity) => void;
}

export function createtInitialCrudContext<T>(items: T[]): CrudContext<T> {
    return {
        items: () => items,
        get: (item: Identity) => undefined,
        update: () => {},
        create: () => {},
        delete: () => {},
    };
}

export function createItemCrud<T extends Identity> (items: T[], listener?: () => void): CrudContext<T> & {listener?: () => void} {
    const itemCrud: CrudContext<T> & {
        listener?: () => void;
        itemMap: Map<string, T>;
    } = {
        itemMap: items.reduce((map, item: T) => {map.set(item.id, item); return map}, new Map<string, T>()),
        items: function () {
            return Array.from(this.itemMap.values());
        },
        update: function (item) {
            const currentItem = this.itemMap.get(item.id);
            Object.assign(currentItem, item);
            if (this.listener) this.listener();
        },
        get: function(item: Identity) {
            return this.itemMap.get(item.id);
        },
        create: function (item) {
            this.itemMap.set(item.id, item);
            if (this.listener) this.listener();
        },
        delete: function (item) {
            this.itemMap.delete(item.id)
            if (this.listener) this.listener();
        },
        listener: listener
    }
    itemCrud.update = itemCrud.update.bind(itemCrud);
    itemCrud.create = itemCrud.create.bind(itemCrud);
    itemCrud.delete = itemCrud.delete.bind(itemCrud);
    itemCrud.get = itemCrud.get.bind(itemCrud);
    itemCrud.items = itemCrud.items.bind(itemCrud);

    return itemCrud;
}

export function useItemCrud<T extends Identity>(initialItems: T[], itemListener?: (items: CrudContext<T>) => void): CrudContext<T> & {listener?: () => void} {
    const [items, setItems] = useState(
        createItemCrud<T>(initialItems)
    );
    useEffect(() => {
        if (!items.listener) {
            items.listener = function () {
                setItems(Object.assign({}, this));
                if (itemListener) itemListener(this);
            }
            setItems(Object.assign({}, items));
        }
    }, [items.listener]);
    return items;
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