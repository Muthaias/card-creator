import React from 'react';
import { Identity, NamedIdentity } from '../Types';
import { Stack, IconButton, DocumentCard, DocumentCardType, Text, DocumentCardDetails, DocumentCardActions, DocumentCardTitle, Separator } from 'office-ui-fabric-react';
import { stackTokens } from '../Styling';

type Props<T> = {
    title?: string;
    emptyInfo?: string;
    selectedItem?: Identity;
    items: (NamedIdentity & T)[];
    onItemSelected: (item: Identity) => void;
    onRemoveItem?: (item: Identity) => void;
    onAddItem?: () => void;
    renderPreview: React.FunctionComponent<NamedIdentity & T>;
}

export function ItemListPanel<T> (props: Props<T>) {
    const {
        items,
        onItemSelected,
        onRemoveItem,
        renderPreview,
        onAddItem,
    } = props;
    const title = props.title || 'Items';
    const emptyInfo = props.emptyInfo || 'No items added';

    return (
        <Stack tokens={stackTokens}>
            <Stack horizontal styles={{root: {width: '100%'}}}>
                <Separator styles={{root: {width: '100%'}}}>{title}</Separator>
                {onAddItem && <IconButton
                    iconProps={{iconName: 'Add'}}
                    onClick={onAddItem}
                />}
            </Stack>
            {items.map((item, index) => (
                <DocumentCard key={item.id} type={DocumentCardType.compact}>
                    {renderPreview(item)}
                    <DocumentCardDetails>
                        <DocumentCardTitle title={item.name} />
                        <DocumentCardActions
                            actions={[
                                {
                                    iconProps: { iconName: 'Edit' },
                                    onClick: () => onItemSelected(item),
                                    ariaLabel: 'edit item'
                                },
                                ...(onRemoveItem ? [{
                                    iconProps: { iconName: 'Trash' },
                                    onClick: () => onRemoveItem(item),
                                    ariaLabel: 'remove item'
                                }] : [])
                            ]}
                        />
                    </DocumentCardDetails>
                    
                </DocumentCard>
            ))}
            {items.length === 0 && <Stack horizontalAlign='center'><Text>{emptyInfo}</Text></Stack>}
        </Stack>
    );
}