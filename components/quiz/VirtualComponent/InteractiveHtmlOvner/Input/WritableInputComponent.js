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
    }

    set value(string) { if (typeof string !== "string") throw new TypeError(); this.value = string; }
    /** @returns {string} value */
    get value() { return this.value; }

    _handleInputEvent(e) {
        this.storage.value = this._input.value;
        this.onInput(this._input);
    }

    /** @param {HTMLInputElement} element */
    onInput(element) { };

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
    /** @returns {WritableInputMirrorStorage} */
    get state() { if (!this._mirrorStorage) this._mirrorStorage = new WritableInputMirrorStorage(); return this._mirrorStorage.storage; }

    set onInput(callback) { this._mirrorStorage.onInput = callback; }
    get onInput() { return this.mirrorStorage.onInput; }
}