'use strict';

import { MirrorStorage } from "../../MirrorStorage.js";
import { VirtualComponent } from "../../VirtualComponent.js";

/**
 * Хранение хранение и отражение свойств value и secect элемента input.
 * Перехват пользовательского "выбора" интерактивного элемента
 */
class SelectableInputMirrorStorage extends MirrorStorage {
    /**
     * @param {string} value Начальное значение input.value; После может быть изменено через js.
     * @param {boolean} checked Начальное значение input.checked; После может быть изменено как через input так и через js.
     */
    constructor() {
        this.value = "";
        if (this.checked !== undefined) this.checked = false;
        this._handleInputEvent = this._handleInputEvent.bind(this);
        this._allowedTypes = new Set(['checkbox', 'radio']);
        this._inputListeners = new Set();
    }

    /** @returns {SelectableInputMirrorStorage} Прокси для доступа к свойствам хранилища. При записи через прокси свойства будут зеркально отображены в разметку. */
    get storage() { return super.storage(); }

    set value(string) { if (typeof string !== "string") throw new TypeError(); this.value = string; }
    /** @returns {string} value */
    get value() { return this.value; }

    set checked(state) { if (typeof state !== "boolean") throw new TypeError(); this.checked = state; }
    /** @returns {boolean} value */
    get checked() { return this.checked; }

    _handleInputEvent(e) {
        this.storage.value = this._input.value;
        this.storage.checked = this._input.checked;
        this._activateInputListeners(e);
    }

    /** @param {Function} callback Колбэк вызываемый после пользовательского ввода. */
    addInputListener(callback) { this._inputListeners.add(callback); }
    _activateInputListeners(e) { for (let callback of this._inputListeners) callback(e); }

    attach(rootElement) {
        let rootOfComponent = super.attach(rootElement);

        this._input = rootElement.querySelector('input');
        if (!(this._input instanceof HTMLInputElement)) throw new Error();
        if (!(this._allowedTypes.has(this._input.type))) throw new Error();
        this._input.addEventListener('input', this._handleInputEvent);

        if (this.checked !== undefined) this._input.checked = this.checked;
        else this.checked = this._input.checked;

        if (this.value) this._input.value = this.value;
        else if (this._input.value) this.value = this._input.value;
        return rootOfComponent;
    }

    render(rootElement = this._rootElement) {
        if (!super.render(rootElement)) return false;

        this._input.value = this.value;
        this._input.checked = this.checked;
        return true;
    }
}

/**
 * Реализует поддержание состояния Input'а в виртуальном компоненте. только одного.
 */
export class SelectableInputComponent extends VirtualComponent {
    constructor() {
        super();
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
            this._mirrorStorage = new SelectableInputMirrorStorage();
            this._mirrorStorage.addInputListener(this._onInput)
        }
        return this._mirrorStorage.storage;
    }

    set value(string) { this.state.value = string; }
    /** @returns {string} value */
    get value() { return this.state.value; }

    set checked(state) { this.state.checked = state; }
    /** @returns {boolean} value */
    get checked() { return this.state.checked; }
}