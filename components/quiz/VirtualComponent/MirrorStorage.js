'use strict';

import { camelize } from '../lib.js';
import { TemplateProvider } from './TemplateProvider.js';

/**
 * Играет роль единственного источника истины для активных элементов в компонента. 
 * Синхронизирует внутреннее содержимое элементов компонента со своими свойствами.
 */
export class MirrorStorage {
    constructor() {
        this.render = this.render.bind(this);
        this.attach = this.attach.bind(this);
    }

    /**
     * @returns {MirrorStorage} Прокси для записи свойств в хранилище.
     */
    getSyncProxy() {
        // критическая неоптимизированность. Можно переделать в транзакции или окраничить частоту обновления таймером.
        if (this._syncProxy !== undefined) return this._syncProxy;
        this._syncProxy = new Proxy(this, {
            set: function (target, prop, value, receiver) {
                target[prop] = value;
                target.render();
                return true;
            }
        });
        return this._syncProxy;
    }

    /**
     * Рендер состояний в HTMLElement'ы компонента
     * @param {HTMLElement|DocumentFragment} rootNode - Root-элемент компонента.
     */
    render(rootNode = this._rootElement) {
        if (rootNode === undefined) return false;
        for (let element of rootNode.querySelectorAll("[component-inner]")) {
            let prop = camelize(element.getAttribute('component-inner'));
            if (prop in this) this._insert(element, this[prop]);
            else if (camelize(prop) in this) element.innerHTML = this[prop];
        }
        for (let element of rootNode.querySelectorAll("[component-srcset]")) {
            let prop = camelize(element.getAttribute('component-srcset'));
            if (prop in this) element.srcset = this[prop];
        }
        for (let element of rootNode.querySelectorAll("[component-src]")) {
            let prop = camelize(element.getAttribute('component-src'));
            if (prop in this) element.src = this[prop];
        }
        for (let element of rootNode.querySelectorAll("[component-slot]")) {
            let prop = camelize(element.getAttribute('component-slot'));
            if (this[prop] instanceof TemplateProvider) this[prop].spawnTemplateIn(element);
        }
        return true;
    }

    /**
     * @param {HTMLElement} element
     * @param {*} value
     */
    _insert(element, value) {
        element.innerHTML = value;
    }

    /**
     * Синхронизировать компонент с этим хранилищем
     * @param {HTMLElement} rootElement - Root-элемент компонента.
     */
    attach(rootElement) { this._rootElement = rootElement }
}