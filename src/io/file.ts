import { CardDescriptor } from '../Types';
import { SystemFunctions } from '../Contexts';
import { excelToSimplifiedCardData, importSimplifiedCardData, DefaultSimplifiedCardData } from './excelimport'

export function downloadObject(object: Object, name: string) {
    const dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(object, undefined, '    '));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataString);
    anchor.setAttribute('download', name + '.json');
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
}

export async function uploadArrayBuffer(file: File): Promise<ArrayBuffer> {
    const reader = new FileReader();
    const dataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = (event) => {
            if (event.target) {
                const content = event.target.result;
                if (content instanceof ArrayBuffer) {
                    resolve(content);
                } else {
                    reject('File is of wrong type.');
                }
            } else {
                reject('Could not load file.');
            }
        }
    });
    reader.readAsArrayBuffer(file);
    return await dataPromise;
}

export async function uploadObject(file: File) {
    const reader = new FileReader();
    const loadPromise = new Promise<string>((resolve, reject) => {
        reader.onload = (event) => {
            if (event.target) {
                const content = event.target.result;
                if (typeof content === 'string') {
                    resolve(content);
                } else {
                    reject('File is of wrong type.');
                }
            } else {
                reject('Could not load file.');
            }
        }
    });
    reader.readAsText(file);
    const dataString = await loadPromise;
    return JSON.parse(dataString);
}

export function createFileFunctions<T extends Object>(
    onBundleData: () => T,
    onLoadData: (data: T) => void,
    onLoadExcel: (data: CardDescriptor[]) => void,
    onError: (error: string) => void = () => {}
): SystemFunctions {
    return {
        loadJSON: async (file: File) => {
            try {
                const data = await uploadObject(file);
                onLoadData(data);
            } catch (e) {
                onError('Failed to load file: ' + e.message);
            }
        },
        loadExcel: async (file: File) => {
            try {
                const buffer = await uploadArrayBuffer(file);
                const partialData = await excelToSimplifiedCardData(buffer);
                const data = importSimplifiedCardData(partialData.map(partialCard => Object.assign({}, DefaultSimplifiedCardData, partialCard)));
                onLoadExcel(data);
            } catch (e) {
                onError('Failed to load file: ' + e.message);
            }
        },
        downloadJSON: (name: string) => {
            try {
                const data = onBundleData();
                downloadObject(data, name);
            } catch (e) {
                onError('Failed to store file: ' + name);
            }
        }
    };
}