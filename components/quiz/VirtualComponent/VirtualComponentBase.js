'use strict';

import { MirrorStorage } from "./MirrorStorage.js";
import { TemplateProvider } from "./TemplateProvider.js";

/**
 * Монолит который связывает TemplateProvider c MirrorStorage и реализует модель.
 */
export class VirtualComponentBase {
    constructor() {
        this._slotToComponentList = new Map();
    }
    /**
     * @param {TemplateProvider} templateProvider
     */
    set _templateProvider(templateProvider) {
        if (this._templateProvider !== undefined) throw new Error('Нельзя переопределить TemplateProvider компонента');
        this._templateProvider = templateProvider;
    }

    /**
     * @returns {TemplateProvider}
     */
    get _templateProvider() { return this._templateProvider; }

    /**
     * @param {MirrorStorage} mirrorStorage
     */
    set _mirrorStorage(mirrorStorage) {
        if (this._mirrorStorage !== undefined) throw new Error('Нельзя переопределить MirrorStorage компонента');
        this._mirrorStorage = mirrorStorage;
    }

    /**
     * @returns {MirrorStorage}
     */
    get _mirrorStorage() { return this._mirrorStorage.getSyncProxy(); }

    /**
     * @param { VirtualComponentBase } component
     * @param { string } slotName
     */
    appendInSlot(component, slotName) {
        let list = this._slotToComponentList;
        if (!list.has(slotName)) this._slotToComponentList.set(slotName, new Set());

        if (list.has(slotName)) return true;
        list.get(slotName).add(component);
        this._updateSlotState(slotName);
        return true;
    }

    /**
     * @param {string} slotName 
     */
    clearSlot(slotName) {
        let list = this._slotToComponentList;
        if (!list.has(slotName)) return false;
        if (!list.get(slotName).size) return true;
        list.get(slotName).clear();
        this._updateSlotState(slotName);
        return true;
    }

    /**
     * @param {string} slotName 
     * @returns {Array} components
     */
    _getComponentsInSlot(slotName) {
        if (!this._slotToComponentList.has(slotName)) return [];
        return Array.from(this._slotToComponentList.get(slotName));
    }

    /**
     * @param {string} slotName
     * @returns {Element} slot
     */
    _findSlotElement(slotName) { return this.html.querySelector(`[component-slot="${slotName}"]`); }

    /**
     * @param {string} slotName 
     * @param {VirtualComponentBase} component 
     */
    _spawnComponentInSlotElement(slotName, component) { this._findSlotElement(slotName).appendChild(component.createHTML()); }

    /** @param {string} slotName */
    _clearSlotElement(slotName) { this._findSlotElement(slotName).innerHTML = ""; }

    _updateSlotState(slotName) {
        let slot = this._findSlotElement(slotName);
        slot.innerHTML = "";
        for (let component of this._getComponentsInSlot(slotName)) this._spawnComponentInSlotElement(slot, component);
    }

    createHTML() {
        let html = this._templateProvider.createHTML();
        this.html = html;
        this._mirrorStorage.attach(this.html);
        for (let slotName of this._slotToComponentList.keys) this._updateSlotState(slotName);
        this.createHTML()
        return html;
    }

    // /**
    //  * Возвращает десериализованый компонент
    //  * @param {Object} serializedVirtualComponent
    //  * @returns {VirtualComponent}
    //  */
    // deserializeComponent(serializedVirtualComponent) { }

    // /**
    //  * Реестр компонентов
    //  */
    // static _VCRegister = [];

    // /**
    // * Зарегистрировать сопоставление имени и класса для десериализации компонентов
    // * @param {Function} constructor конструктор
    // * @param {string} alias псевдоним
    // */
    // static registerComponent(constructor, alias = undefined) {
    //     if (typeof constructor === 'function' && typeof alias === 'undefined') {
    //         // передан один аргумент - конструктор
    //         alias = constructor.name;
    //     }

    //     this._VCRegister[alias] = constructor;
    // }

    // /**
    //  * Возвращает экземпляр расширенного класса VirtualComponent на основе сериализованых мета-данных.
    //  * @param {Object} serializedVirtualComponent
    //  * @returns {VirtualComponent} Конструктор расширенного класса.
    //  */
    // static locateSerializedComponent(serializedVirtualComponent) {
    //     let constructor = this._VCRegister[serializedVirtualComponent.component];
    //     if (!constructor) throw TypeError(`${serializedVirtualComponent.component} не был зарегестрирован в ${typeof this}`);
    //     return constructor;
    // }
}