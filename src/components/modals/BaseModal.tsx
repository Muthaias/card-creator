import React from 'react';
import { Stack, DefaultButton, PrimaryButton, DialogFooter } from '@fluentui/react';
import { stackTokens } from '../../Styling';

type Props = {
    onConfirm: () => void;
    onCancel: () => void;
    cancelText?: string;
    confirmText?: string;
    children: React.ReactNode;
}

export const BaseModal: React.FunctionComponent<Props> = (props: Props) => {
    const {
        onConfirm,
        onCancel,
        children,
        cancelText = 'Cancel',
        confirmText = 'Ok',
    } = props;

    return (
        <>
            <Stack tokens={stackTokens}>
                {children}
            </Stack>
            <DialogFooter>
                <DefaultButton onClick={onCancel}>{cancelText}</DefaultButton>
                <PrimaryButton onClick={onConfirm}>{confirmText}</PrimaryButton>
            </DialogFooter>
        </>
    );
}