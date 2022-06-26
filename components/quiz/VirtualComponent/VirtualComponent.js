'use strict';

import { MirrorStorage } from "./MirrorStorage.js";
import { TemplateProvider } from "./TemplateProvider.js";

/**
 * Виртуальный компонент с разметкой хранащейся в \<template>.
 * 
 * Имеет внутренние состояния которые зеркально отображаются на HTMLElement'ы.
 * Позволяет использовать component-slot для вставки других компонентов в собственную разметку.
 */
export class VirtualComponent {
    /** @param {HTMLTemplateElement} htmlTemplate по умолчанию равен 'auto' */
    constructor(htmlTemplate = 'auto') {
        if (htmlTemplate !== 'auto') {
            if (!TemplateProvider.validateTemplate(htmlTemplate)) throw new TypeError('Был передан неверный аргумент htmlTemplate');
            this._templateProvider = new TemplateProvider(htmlTemplate);
        } else {
            let template = this._findSelfTemplate();
            if (!template) throw new Error('Для компонента не был передан <template> и автопоиск не нашел <template>.');
            this._templateProvider = new TemplateProvider(template);
        }
        this._slotMap = new Map();
    }

    /** @returns {HTMLTemplateElement|null} htmlTemplate */
    _findSelfTemplate() {
        let htmlTemplate = TemplateProvider.findTemplateByName(this.constructor.name);
        if (htmlTemplate) return htmlTemplate;
        htmlTemplate = TemplateProvider.findTemplateByName(kebabize(this.constructor.name));
        if (htmlTemplate) return htmlTemplate;
        return null;
    }

    /**  @returns {TemplateProvider} */
    get _templateProvider() { return this._templateProvider; }
    /**  @param {TemplateProvider} value */
    set _templateProvider(value) { if (!(value instanceof TemplateProvider)) throw new TypeError(); this._templateProvider = value; }

    /** state определен как виртуальное свойство для возможности переопределения дочерними классами вне конструктора. */
    get state() { if (!this._mirrorStorage) this._mirrorStorage = new MirrorStorage(); return this._mirrorStorage.storage; }

    /** @returns {HTMLElement} */
    get html() {
        if (!this._html) this._html = this._templateProvider.createHTML();
        this._onCreateHtml(this.html);
        return html;
    }

    _onCreateHtml(html) {
        this.state.attach(this.html);
        for (let slotName of this._slotMap.keys) this._updateSlotState(slotName);
    }


    // Надо все операции с компонентами в слотах заменить на прокси к Set
    // Надо вообще всю логику слота инкапсулировать в отдельный класс типа "ComponentRoot" 
    // а потом этот класс расширить до UserInputVirtualComponent и можно будет подойти к реализации fieldset и select>options

    /**
     * @param { VirtualComponent } component
     * @param { string } slotName
     */
    appendInSlot(component, slotName) {
        if (!this._slotMap.has(slotName)) this._slotMap.set(slotName, new Set());
        if (this._slotMap.get(slotName).has(component)) return true;

        this._slotMap.get(slotName).add(component);
        this._updateSlotState(slotName);
        return true;
    }

    /**
     * @param {string} slotName 
     */
    clearSlot(slotName) {
        if (!this._slotMap.has(slotName)) return false;
        if (!this._slotMap.get(slotName).size) return true;

        this._slotMap.get(slotName).clear();
        this._updateSlotState(slotName);
        return true;
    }

    /**
     * @param {string} slotName 
     * @returns {Array} components
     */
    _getComponentsInSlot(slotName) {
        if (!this._slotMap.has(slotName)) return [];
        return Array.from(this._slotMap.get(slotName));
    }

    /**
     * @param {string} slotName
     * @returns {Element} slot
     */
    _findSlotElement(slotName) { return this.html.querySelector(`[component-slot="${slotName}"]`); }

    /**
     * @param {string} slotName 
     * @param {VirtualComponent} component 
     */
    _spawnComponentInSlotElement(slotName, component) { this._findSlotElement(slotName).appendChild(component.createHTML()); }

    /** @param {string} slotName */
    _clearSlotElement(slotName) { this._findSlotElement(slotName).innerHTML = ""; }

    _updateSlotState(slotName) {
        let slot = this._findSlotElement(slotName);
        slot.innerHTML = "";
        for (let component of this._getComponentsInSlot(slotName)) this._spawnComponentInSlotElement(slot, component);
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