import React, { useContext, useState, useRef, useEffect } from 'react';
import { Stack, TextField, Separator, DefaultButton } from '@fluentui/react';
import { stackTokens } from '../../Styling';
import { Settings, SettingsContext } from '../../Settings';
import { SystemContext } from '../../Contexts';

type Props = Settings & {
    update: React.Dispatch<Partial<Settings>>,
    load: (file: File) => void;
    save: (name: string) => void;
};

export const SettingsEditorCore: React.FunctionComponent<Props> = (props) => {
    const {
        exportTargetId,
        targetRestRoot,
        downloadFileName,
        saveDelay,
        exportDelay,
        update,
        load,
        save,
    } = props;

    const [file, setFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const ioGroup: ([string, keyof Props, string])[] = [
        ['Export Target ID', 'exportTargetId', exportTargetId],
        ['Target Rest Root', 'targetRestRoot', targetRestRoot],
        ['Download File Name', 'downloadFileName', downloadFileName],
    ];
    const timingsGroup: ([string, keyof Props, number])[] = [
        ['Save Delay', 'saveDelay', saveDelay],
        ['Export Delay', 'exportDelay', exportDelay],
    ];
    useEffect(() => {
        if (file) {
            update({downloadFileName: file.name});
            load(file);
        }
    }, [file]);

    return (
        <Stack tokens={stackTokens} styles={{root: {width: '100%'}}}>
            <Separator styles={{root: {width: '100%'}}}>I/O</Separator>
            {ioGroup.map(([name, key, value]) => (
                <TextField
                    key={key}
                    label={name}
                    styles={{root: {width: '100%'}}}
                    value={value}
                    onChange={(_, newValue) => newValue !== undefined && update({[key]: newValue})}
                />
            ))}
            <input
                type='file'
                ref={fileRef}
                style={{display: 'none'}}
                onChange={(event) => event.target && event.target.files && setFile(event.target.files[0])
            }/>
            <Separator styles={{root: {width: '100%'}}}>File Operations</Separator>
            <DefaultButton
                onClick={() => save(downloadFileName)}
                text='Download data'
                iconProps={{iconName: 'Save'}}
            />
            <DefaultButton
                onClick={() => {
                    const current = fileRef.current;
                    if (current) current.click();
                }}
                text={file ? file.name : 'Select a file to load'}
                iconProps={{iconName: 'OpenFile'}}
            />
            <Separator styles={{root: {width: '100%'}}}>Timings</Separator>
            {timingsGroup.map(([name, key, value]) => (
                <TextField
                    key={key}
                    label={name}
                    styles={{root: {width: '100%'}}}
                    value={value + ''}
                    type='number'
                    onChange={(_, newValue) => newValue !== undefined && update({[key]: parseInt(newValue)})}
                />
            ))}
        </Stack>
    );
}

export const SettingsPanel: React.FunctionComponent<{}> = () => {
    const settings = useContext(SettingsContext);
    const system = useContext(SystemContext);
    return (
        <SettingsEditorCore {...settings.settings} update={settings.update} load={system.loadFile} save={system.downloadFile}/>
    );
}