'use strict';

import { MirrorStorage } from "../../MirrorStorage.js";
import { VirtualComponent } from "../../VirtualComponent.js";


/**
 * Поддерживает хранение и отражение value элемента input. 
 * Перехват пользовательского ввода значений в input. 
 */
class WritableInputMirrorStorage extends MirrorStorage {
    /** @param {string} value Начальное значение input.value; После может быть изменено как через input так и через js. */
    constructor(value = "") {
        this.value = value;
        this._handleInputEvent = this._handleInputEvent.bind(this);
        this._inputListeners = new Set();
    }

    set value(string) { if (typeof string !== "string") throw new TypeError(); this.value = string; }
    /** @returns {string} value */
    get value() { return this.value; }

    _handleInputEvent(e) {
        this.storage.value = this._input.value;
        this._activateInputListeners(e);
    }

    /** @param {Function} callback Колбэк вызываемый после пользовательского ввода. */
    addInputListener(callback) { this._inputListeners.add(callback); }
    _activateInputListeners(e) { for (let callback of this._inputListeners) callback(e); }

    attach(rootElement) {
        let rootOfComponent = super.attach(rootElement);

        this._input = rootElement.querySelector('input');
        if (!(this._input instanceof HTMLInputElement)) throw new Error();
        this._input.addEventListener('input', this._handleInputEvent);
        if (this.value) this._input.value = this.value;
        else if (this._input.value) this.value = this._input.value;
        return rootOfComponent;
    }

    render(rootElement = this._rootElement) {
        if (!super.render(rootElement)) return false;

        this._input.value = this.value;
        return true;
    }
}

/**
 * Реализует поддержание состояния Input'а в виртуальном компоненте. только одного.
 */
export class WritableInputComponent extends VirtualComponent {
    /** @param {HTMLTemplateElement} template */
    constructor(template) {
        super(template);
        this._onInput = this._onInput.bind(this);
        this._inputListeners = new Set();
    }

    _onInput(e) { this._activateInputListeners(this); }

    /** @param {Function} callback Колбэк вызываемый после пользовательского ввода. */
    addInputListener(callback) { this._inputListeners.add(callback); }
    _activateInputListeners(component) { for (let callback of this._inputListeners) callback(component); }

    /** @returns {SelectableInputMirrorStorage} */
    get state() {
        if (!this._mirrorStorage) {
            this._mirrorStorage = new WritableInputMirrorStorage();
            this._mirrorStorage.addInputListener(this._onInput)
        }
        return this._mirrorStorage.storage;
    }
    
    set value(string) { this.state.value = string; }
    /** @returns {string} value */
    get value() { return this.state.value; }

    set onInput(callback) { this._mirrorStorage.onInput = callback; }
    /** @returns {Function} callback */
    get onInput() { return this._mirrorStorage.onInput; }
}