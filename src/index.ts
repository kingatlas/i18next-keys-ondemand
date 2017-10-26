import * as debounce from 'debounce';

export interface TranslationMap {
    [key: string]: string;
}

export type TranslationGetter = (keys: string[], language: string, namespace: string) => Promise<TranslationMap>;

interface KeyQueue {
  [path: string]: KeysSet;
}
interface KeysSet {
  [key: string]: boolean;
}

export interface Options {
    translationGetter: TranslationGetter;
    debounceDelay?: number;
}

export class I18nextKeysOnDemand {

    type = '3rdParty';
    translationGetter: TranslationGetter;
    debounceDelay: number;

    constructor(options: Options) {
       this.translationGetter = options.translationGetter;
       this.debounceDelay = options.debounceDelay || 100;
    }

    public init(instance: i18next.i18n) {

        const missingKeysQueue: KeyQueue = {};
        const translationGetter = this.translationGetter;
        const debounceDelay = this.debounceDelay;

        function requestResources(lng: string, ns: string) {
            const path = `${lng}.${ns}`;
            translationGetter(Object.keys(missingKeysQueue[path]), lng, ns).then((result) => {
                missingKeysQueue[path] = {};
                instance.addResources(lng, ns, result);
            });
        }
    
        const debouncedRequestResources: {[path: string]: () => void } = {};
        function requestKey(key: string, lng: string, ns: string) {
        const path = `${lng}.${ns}`;
        missingKeysQueue[path] = missingKeysQueue[path] || {};
        missingKeysQueue[path][key] = true;
            
        debouncedRequestResources[path] = debouncedRequestResources[path] ||
                                            debounce(() => requestResources(lng, ns), debounceDelay, undefined);
        debouncedRequestResources[path]();
        }
    
        instance.on('missingKey', (lngs: string | string[], ns: string, key: string, res: string) => {
    
        const languages = typeof lngs === 'string' ? [ lngs ] : lngs;
        languages.map(l => requestKey(key, l, ns));
        });
    }
}
