import * as i18n from 'i18next';
import { I18nextKeysOnDemand, TranslationGetter } from '../src/index';
import { delay, on } from './utils';

describe('I18nextKeysOnDemand', () => {

    const LANG = 'fr';
    const NS = 'namespace1';

    it('should request missing keys', on(async () => {
        // arrange
        const translationGetter = jest.fn<TranslationGetter>();
        translationGetter.mockReturnValue(Promise.resolve({ MISSING_KEY: 'translated.MISSING_KEY' }));
        
        const i18nInstance: i18next.i18n = i18n
        .createInstance()
        .use(new I18nextKeysOnDemand({ translationGetter }))
        .init({
          fallbackLng: LANG,
          ns: [NS],
          defaultNS: NS
        });

        // act
        i18nInstance.t('MISSING_KEY');
        await delay(150);

        // assert
        expect(translationGetter.mock.calls.length).toBe(1);
        expect(translationGetter.mock.calls[0][0]).toEqual(['MISSING_KEY']);
        expect(i18nInstance.t('MISSING_KEY')).toBe('translated.MISSING_KEY');
    }));

    it('should return empty string for missing key', on(async () => {
        // arrange
        const translationGetter = jest.fn<TranslationGetter>();
        translationGetter.mockReturnValue(Promise.resolve({ MISSING_KEY: 'translated.MISSING_KEY' }));
        
        const i18nInstance: i18next.i18n = i18n
        .createInstance()
        .use(new I18nextKeysOnDemand({ translationGetter }))
        .init({
          fallbackLng: LANG,
          ns: [NS],
          defaultNS: NS,
          defaultValue: ''
        });

        // act
        const translation = i18nInstance.t('MISSING_KEY');

        // assert
        expect(translation).toBe('');
    }));

    it('should be able to override default value for missing key', on(async () => {
        // arrange
        const translationGetter = jest.fn<TranslationGetter>();
        translationGetter.mockReturnValue(Promise.resolve({ MISSING_KEY: 'translated.MISSING_KEY' }));
        
        const i18nInstance: i18next.i18n = i18n
        .createInstance()
        .use(new I18nextKeysOnDemand({ translationGetter, missingKeyValue: 'MISSING' }))
        .init({
          fallbackLng: LANG,
          ns: [NS],
          defaultNS: NS,
          defaultValue: ''
        });

        // act
        const translation = i18nInstance.t('MISSING_KEY');

        // assert
        expect(translation).toBe('MISSING');
    }));

    it('should gather missing keys request', on(async () => {
        // arrange
        const translationGetter = jest.fn<TranslationGetter>();
        translationGetter.mockReturnValue(Promise.resolve({
            MISSING_KEY1: 'translated.MISSING_KEY1',
            MISSING_KEY2: 'translated.MISSING_KEY2' }));
        
        const i18nInstance: i18next.i18n = i18n
        .createInstance()
        .use(new I18nextKeysOnDemand({ translationGetter }))
        .init({
          fallbackLng: LANG,
          ns: [NS],
          defaultNS: NS
        });

        // act
        i18nInstance.t('MISSING_KEY1');
        i18nInstance.t('MISSING_KEY2');
        await delay(150);

        // assert
        expect(translationGetter.mock.calls.length).toBe(1);
        expect(translationGetter.mock.calls[0][0]).toEqual(['MISSING_KEY1', 'MISSING_KEY2']);
        expect(i18nInstance.t('MISSING_KEY1')).toBe('translated.MISSING_KEY1');
    }));

    it('should be able to override the request debounce delay', on(async () => {
        // arrange
        const translationGetter = jest.fn<TranslationGetter>();
        translationGetter.mockReturnValue(Promise.resolve({
            MISSING_KEY1: 'translated.MISSING_KEY1',
            MISSING_KEY2: 'translated.MISSING_KEY2' }));
        
        const i18nInstance: i18next.i18n = i18n
        .createInstance()
        .use(new I18nextKeysOnDemand({ translationGetter, debounceDelay: 500 }))
        .init({
          fallbackLng: LANG,
          ns: [NS],
          defaultNS: NS
        });

        // act
        i18nInstance.t('MISSING_KEY1');
        await delay(200);
        i18nInstance.t('MISSING_KEY2');
        await delay(550);

        // assert
        expect(translationGetter.mock.calls.length).toBe(1);
        expect(translationGetter.mock.calls[0][0]).toEqual(['MISSING_KEY1', 'MISSING_KEY2']);
        expect(i18nInstance.t('MISSING_KEY1')).toBe('translated.MISSING_KEY1');
    })); 
});
