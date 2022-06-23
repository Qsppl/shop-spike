'use strict';

import { MirrorStorage } from "./MirrorStorage";

class InputMirrorStorage extends MirrorStorage {
    /**
     * @param {*} value value of input
     */
    constructor(value) {
        super();
        this.value = value;
        this._onInput = this._onInput.bind(this);
    }

    _onInput(e) {
        this.onInput(this._input);
        this.getSyncProxy.value = this._input.value;
    }

    onInput(element) {};

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

    _onInput(e) {
        super._onInput(e);
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
        if (this._input) { this._input.addEventListener('change', this._onInput); return true; }
        else return false;
    }
}

export class WritableInputMirrorStorage extends InputMirrorStorage {
    attach(rootElement) {
        if (!super.attach()) return false;

        this._input = rootElement.querySelector('input, textarea');
        if (this._input) { this._input.addEventListener('input', this._onInput); return true; }
        else return false;
    }
}