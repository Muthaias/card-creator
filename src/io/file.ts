import { SystemFunctions } from '../Contexts';

export function downloadObject(object: Object, name: string) {
    const dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(object, undefined, '    '));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataString);
    anchor.setAttribute('download', name + '.json');
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
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
    onError: (error: string) => void = () => {}
): SystemFunctions {
    return {
        loadFile: async (file: File) => {
            try {
                const data = await uploadObject(file);
                onLoadData(data);
            } catch (e: any) {
                onError('Failed to load file: ' + e.message);
            }
        },
        downloadFile: (name: string) => {
            try {
                const data = onBundleData();
                downloadObject(data, name);
            } catch (e) {
                onError('Failed to store file: ' + name);
            }
        }
    };
}