'use strict';

require('../lib');

/**
 * Играет роль единственного источника истины для активных элементов в компонента. 
 * Синхронизирует внутреннее содержимое элементов компонента со своими свойствами.
 */
 class MirrorStorage {
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
        for (let element of rootNode.querySelectorAll("[component-state]")) {
            let prop = element.dataset.mirror;
            if (prop in this) this._insert(element, this[prop]);
            else if (camelize(prop) in this) this._insert(element, camelize(prop));
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