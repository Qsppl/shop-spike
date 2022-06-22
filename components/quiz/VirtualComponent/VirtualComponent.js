'use strict';

import { kebabize } from '../lib.js';
import { MirrorStorage } from './MirrorStorage.js';
import { TemplateProvider } from './TemplateProvider.js';

/**
 * Монолит который связывает TemplateProvider c MirrorStorage и реализует модель.
 */
export class VirtualComponent {
    /**
     * @param {TemplateProvider} templateProvider 
     */
    constructor() {
        this.mirrorStorage = new MirrorStorage();

        let htmlTemplate = document.getElementById(kebabize(this.constructor.name));
        console.log(`search ${this.constructor.name}>${kebabize(this.constructor.name)}: ${htmlTemplate}`);
        if (TemplateProvider.validateTemplate(htmlTemplate)) {
            this.templateProvider = new TemplateProvider(htmlTemplate);
        }
    }

    /**
     * @param {TemplateProvider} templateProvider
     */
    set templateProvider(templateProvider) {
        if (this._templateProvider !== undefined) throw new Error('Нельзя переопределить TemplateProvider компонента');
        this._templateProvider = templateProvider;
        templateProvider.addBeforeSpawnListener(this._mirrorStorage.render);
        templateProvider.addAfterSpawnListener(this._mirrorStorage.attach);
    }

    /**
     * @returns {TemplateProvider}
     */
    get templateProvider() { return this._templateProvider }

    /**
     * @param {MirrorStorage} mirrorStorage
     */
    set mirrorStorage(mirrorStorage) {
        if (this._mirrorStorage !== undefined) throw new Error('Нельзя переопределить MirrorStorage компонента');
        this._mirrorStorage = mirrorStorage;
    }

    /**
     * @returns {MirrorStorage}
     */
    get mirrorStorage() { return this._mirrorStorage.getSyncProxy() }

    /**
     * Возвращает десериализованый компонент
     * @param {Object} serializedVirtualComponent
     * @returns {VirtualComponent}
     */
    deserializeComponent(serializedVirtualComponent) { }

    /**
     * Реестр компонентов
     */
    static _VCRegister = [];

    /**
    * Зарегистрировать сопоставление имени и класса для десериализации компонентов
    * @param {Function} constructor конструктор
    * @param {string} alias псевдоним
    */
    static registerComponent(constructor, alias = undefined) {
        if (typeof constructor === 'function' && typeof alias === 'undefined') {
            // передан один аргумент - конструктор
            alias = constructor.name;
        }

        this._VCRegister[alias] = constructor;
    }

    /**
     * Возвращает экземпляр расширенного класса VirtualComponent на основе сериализованых мета-данных.
     * @param {Object} serializedVirtualComponent
     * @returns {VirtualComponent} Конструктор расширенного класса.
     */
    static locateSerializedComponent(serializedVirtualComponent) {
        let constructor = this._VCRegister[serializedVirtualComponent.component];
        if (!constructor) throw TypeError(`${serializedVirtualComponent.component} не был зарегестрирован в ${typeof this}`);
        return constructor;
    }
}