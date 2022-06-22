'use strict';

import { camelize, kebabize } from '../lib.js';
import { TemplateProvider } from './TemplateProvider.js';

/**
 * Играет роль единственного источника истины для активных элементов в компонента. 
 * Синхронизирует внутреннее содержимое элементов компонента со своими свойствами.
 */
export class MirrorStorage {
    // Это целесообразнее сделать TemplateMutator'ом
    constructor() {
        this.render = this.render.bind(this);
        this.attach = this.attach.bind(this);

        this.declareAttrToRenderInner('component-inner');
        
        this.declareAttrToRenderAttr('component-srcset');
        this.declareAttrToRenderAttr('component-src');
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
            for (let element of rootNode.querySelectorAll(`[${targetAttr}]`)) {
                let storagePropName = camelize(element.getAttribute(targetAttr));
                if (storagePropName in this) element.innerHTML = this[storagePropName];
            }
        }
    }

    selfAttrRender() {
        for (let targetAttr of this._AttrToRenderAttr) {
            for (let element of rootNode.querySelectorAll(`[${targetAttr}]`)) {
                let storagePropName = camelize(element.getAttribute(targetAttr));
                if (storagePropName in this) {
                    // из, например, "component-srcset" убираем "component-" (from storagePropName.search('-')+1 to storagePropName.length)
                    $attr = storagePropName.substring(storagePropName.search('-') + 1, storagePropName.length);
                    element[$attr] = this[storagePropName];
                }
            }
        }
        for (let element of rootNode.querySelectorAll("[component-srcset]")) {
            let prop = camelize(element.getAttribute('component-srcset'));
            if (prop in this) element.srcset = this[prop];
        }
    }

    /**
     * Рендер состояний в HTMLElement'ы компонента
     * @param {HTMLElement|DocumentFragment} rootNode - Root-элемент компонента.
     */
    render(rootNode = this._rootElement) {
        if (rootNode === undefined) return false;
        this.selfInnerRender();
        this.selfAttrRender();
        return true;
    }

    /**
     * Синхронизировать компонент с этим хранилищем
     * @param {HTMLElement} rootElement - Root-элемент компонента.
     */
    attach(rootElement) { this._rootElement = rootElement }
}