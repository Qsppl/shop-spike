'use strict';

import { camelize, kebabize } from '../lib.js';

/**
 * Играет роль единственного источника истины для активных элементов в компонента. 
 * Синхронизирует состояние элементов компонента со своими свойствами.
 */
export class MirrorStorage {
    constructor() {
        this.render = this.render.bind(this);
        this.attach = this.attach.bind(this);

        this.declareAttrToRenderInner('component-inner');

        this.declareAttrToRenderAttr('component-srcset');
        this.declareAttrToRenderAttr('component-src');

        this.attach = this._postRenderProxy(this.attach)
    }

    _postRenderProxy(f) {
        return new Proxy(f, {
            apply(target, thisArg, args) {
                let result = target.apply(thisArg, args);
                thisArg.render();
                return result;
            }
        })
    }

    /**
     * Прокси для доступа к свойствам хранилища. 
     * При записи через прокси свойства будут зеркально отображены в разметку.
     */
    // критическая неоптимизированность. Можно переделать в транзакции или окраничить частоту обновления таймером.
    get storage() {
        if (this._syncProxy !== undefined) return this._syncProxy;
        this._syncProxy = new Proxy(this, {
            get(target, prop) {
                let value = target[prop];
                // пробрасываем методам объекта ссылку на объект а то будут через прокси работать и у кого-то случится беда с башкой при попытке разобраться в происходящем.
                if ((typeof value === 'function')) value = value.bind(target);
                return value;
            },
            set(target, prop, value, receiver) {
                target[prop] = value;
                target.render();
                return true;
            }
        });
        return this._syncProxy;
    }

    _AttrToRenderInner = new Set();
    declareAttrToRenderInner(attrName) {
        this._AttrToRenderInner.add(attrName);
    }

    _AttrToRenderAttr = new Set();
    declareAttrToRenderAttr(attrName) {
        this._AttrToRenderAttr.add(attrName);
    }

    selfInnerRender() {
        for (let targetAttr of this._AttrToRenderInner) {
            for (let element of this._rootElement.querySelectorAll(`[${targetAttr}]`)) {
                let storagePropName = camelize(element.getAttribute(targetAttr));
                if (storagePropName in this) element.innerHTML = this[storagePropName];
            }
        }
    }

    selfAttrRender() {
        for (let targetAttr of this._AttrToRenderAttr) {
            for (let element of this._rootElement.querySelectorAll(`[${targetAttr}]`)) {
                let storagePropName = camelize(element.getAttribute(targetAttr));
                if (storagePropName in this) {
                    // из, например, "component-srcset" убираем "component-" (from storagePropName.search('-')+1 to storagePropName.length)
                    let attribute = storagePropName.substring(storagePropName.search('-') + 1, storagePropName.length);
                    element[attribute] = this[storagePropName];
                }
            }
        }
    }

    /** обновить состояние разметки в соответствии с состоянием хранилища */
    render() {
        if (!this._rootElement) return false;
        this.selfInnerRender();
        this.selfAttrRender();
        return true;
    }

    /**
     * Применить состояние хранилища к разметке
     * @param {HTMLElement} rootElement - корневой элемент HTML разметки компонента.
     */
    attach(rootElement) {
        if (!(rootElement instanceof HTMLElement)) throw new TypeError();
        this._rootElement = rootElement;
    }
}