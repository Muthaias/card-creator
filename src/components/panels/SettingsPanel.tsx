import React, { useContext } from 'react';
import { Stack, IconButton, TextField, Separator, Text } from 'office-ui-fabric-react';
import { ParameterDescriptor, ParameterType, Identity } from '../../Types';
import { ParametersContext } from '../../Contexts';
import { stackTokens } from '../../Styling';
import { Settings, SettingsContext } from '../../Settings';

type Props = Settings & {
    update: React.Dispatch<Partial<Settings>>,
};

export const SettingsEditorCore: React.FunctionComponent<Props> = (props) => {
    const {
        exportTargetId,
        targetRestRoot,
        downloadFileName,
        saveDelay,
        exportDelay,
        update,
    } = props;

    const ioGroup: ([string, keyof Props, string])[] = [
        ["Export Target ID", "exportTargetId", exportTargetId],
        ["Target Rest Root", "targetRestRoot", targetRestRoot],
        ["Download File Name", "downloadFileName", downloadFileName],
    ];
    const timingsGroup: ([string, keyof Props, number])[] = [
        ["Save Delay", "saveDelay", saveDelay],
        ["Export Delay", "exportDelay", exportDelay],
    ];

    return (
        <Stack tokens={stackTokens} styles={{root: {width: "100%"}}}>
            <Separator styles={{root: {width: "100%"}}}>I/O</Separator>
            {ioGroup.map(([name, key, value]) => (
                <TextField
                    key={key}
                    label={name}
                    styles={{root: {width: "100%"}}}
                    value={value}
                    onChange={(_, newValue) => newValue !== undefined && update({[key]: newValue})}
                />
            ))}
            <Separator styles={{root: {width: "100%"}}}>Timings</Separator>
            {timingsGroup.map(([name, key, value]) => (
                <TextField
                    key={key}
                    label={name}
                    styles={{root: {width: "100%"}}}
                    value={value + ""}
                    type='number'
                    onChange={(_, newValue) => newValue !== undefined && update({[key]: parseInt(newValue)})}
                />
            ))}
        </Stack>
    );
}

export const SettingsPanel: React.FunctionComponent<{}> = () => {
    const settings = useContext(SettingsContext);
    return (
        <SettingsEditorCore {...settings.settings} update={settings.update}/>
    );
}