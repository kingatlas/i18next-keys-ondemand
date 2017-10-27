[![npm version](https://badge.fury.io/js/i18next-keys-ondemand.svg)](https://www.npmjs.com/package/i18next-keys-ondemand)

# I18next with ability to download missing keys 

Existing [i18next](https://github.com/i18next/i18next) offers backend plugins like [i18next-xhr-backend](https://github.com/i18next/i18next-xhr-backend), but those plugins are requesting keys by namespaces and not at the granularity of an individual key.
The goal of this module is to be able to fetch missing keys individually, taking in consideration performances by debouncing the requests in a individual request.

# Installation

```bash
# using npm
$ npm install i18next-keys-ondemand

# using yarn
$ yarn add i18next-keys-ondemand

```

# Who to use it?

- Use the module when initializing i18next:

```TypeScript
import * as i18n from 'i18next';
import { I18nextKeysOnDemand, TranslationMap } from 'i18next-keys-ondemand';



function translationService(keys: string[]) {
    // simulate AJAX call
    return new Promise<TranslationMap>((resolve) => {
        const result: TranslationMap = {};
        keys.map(k => { result[k] = 'translation of ' + k; });

        setTimeout(() => {
            resolve(result);
        },         50);
    });
}

i18n
  .use(new I18nextKeysOnDemand({ translationGetter: translationService })) // init i18next here
  .init({
    fallbackLng: 'en',
    ns: ['thenamespace'],
    defaultNS: 'thenamespace'
  });
```

- The options:

| Field  | Mandatory? | Default value | Comment |
| ------ | ------ | ------ | ------ |
| `translationGetter` | yes |  | Translation service to use |
| `missingKeyValue` | no | '' | Value to return for missing keys |
| `debounceDelay` | no | 100 | Delay in ms used to debounce the translation requests |

