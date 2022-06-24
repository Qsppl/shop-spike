'use strict';

import { MirrorStorage } from "./MirrorStorage";

/**
 * При наличии элемента input в компоненте служит для него источником value 
 */
class InputMirrorStorage extends MirrorStorage {
    /** @param {string} value Начальное значение input.value; После может быть изменено как пользователем так и через js. */
    constructor(value = "") {
        super();
        this.value = value;
        this._handleInputEvent = this._handleInputEvent.bind(this);
    }

    set value(string) { if (typeof string !== "string") throw new TypeError(); this.value = string; }
    get value() { return this.value; }

    _handleInputEvent(e) {
        this.getSyncProxy.value = this._input.value;
        this.onInput(this._input);
    }

    onInput(element) { };

    attach(rootElement) {
        if (!super.attach()) return false;

        this._input = rootElement.querySelector('input, textarea');
        if (this._input) {
            this._input.addEventListener('input', this._handleInputEvent);
            if (this.value) this._input.value = this.value;
            else if (this._input.value) this.value = this._input.value;
            return true;
        }
        throw new Error();
    }

    render(rootNode = this._rootElement) {
        if (!super.render(rootElement)) return false;

        this._input.value = this.value;
        return true;
    }
}

export class SelectableInputMirrorStorage extends InputMirrorStorage {
    constructor(value, selected = false) {
        super();
        this.selected = selected;
    }

    _handleInputEvent(e) {
        super._handleInputEvent(e);
        this.getSyncProxy.selected = this._input.selected;
    }

    render(rootNode = this._rootElement) {
        if (!super.render(rootElement)) return false;
        this._input.selected = this.selected;
        return true;
    }

    attach(rootElement) {
        super();

        this._input = rootElement.querySelector('input[type="checkbox"], input[type="radio"], select');
        if (this._input) { this._input.addEventListener('change', this._handleInputEvent); return true; }
        else return false;
    }
}

export class WritableInputMirrorStorage extends InputMirrorStorage {
}