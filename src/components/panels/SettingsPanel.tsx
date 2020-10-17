import React, { useContext, useState, useRef, useEffect } from 'react';
import { Stack, TextField, Separator, DefaultButton } from '@fluentui/react';
import { stackTokens } from '../../Styling';
import { Settings, SettingsContext } from '../../Settings';
import { SystemContext } from '../../Contexts';

type Props = Settings & {
    update: React.Dispatch<Partial<Settings>>,
    load: (file: File) => void;
    loadExcel: (file: File) => void;
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
        loadExcel,
        save,
    } = props;

    const ioGroup: ([string, keyof Props, string])[] = [
        ['Export Target ID', 'exportTargetId', exportTargetId],
        ['Target Rest Root', 'targetRestRoot', targetRestRoot],
        ['Download File Name', 'downloadFileName', downloadFileName],
    ];
    const timingsGroup: ([string, keyof Props, number])[] = [
        ['Save Delay', 'saveDelay', saveDelay],
        ['Export Delay', 'exportDelay', exportDelay],
    ];

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
            <Separator styles={{root: {width: '100%'}}}>File Operations</Separator>
            <DefaultButton
                onClick={() => save(downloadFileName)}
                text='Download data'
                iconProps={{iconName: 'Save'}}
            />
            <FileUpload text='Select an excel file to load' onSelect={(file: File) => {
                loadExcel(file);
            }}/>
            <FileUpload text='Select a JSON file to load' onSelect={(file: File) => {
                update({downloadFileName: file.name});
                load(file);
            }}/>
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
type FileUploadProps = {
    onSelect: (file: File) => void;
    text: string;
};

const FileUpload: React.FunctionComponent<FileUploadProps> = ({onSelect, text}: FileUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (file) {
            onSelect(file)
        }
    }, [file]);

    return (
        <>
            <input
                type='file'
                ref={fileRef}
                style={{display: 'none'}}
                onChange={(event) => event.target && event.target.files && setFile(event.target.files[0])
            }/>
            <DefaultButton
                onClick={() => {
                    const current = fileRef.current;
                    if (current) current.click();
                }}
                text={file ? file.name : text}
                iconProps={{iconName: 'OpenFile'}}
            />
        </>
    );
}

export const SettingsPanel: React.FunctionComponent<{}> = () => {
    const settings = useContext(SettingsContext);
    const system = useContext(SystemContext);
    return (
        <SettingsEditorCore {...settings.settings} update={settings.update} load={system.loadJSON} loadExcel={system.loadExcel} save={system.downloadJSON}/>
    );
}