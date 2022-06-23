'use strict';

import { VirtualComponentBase } from "../VirtualComponent/VirtualComponentBase.js";
import { SelectableInputMirrorStorage } from "../VirtualComponent/InputMirrorStorage.js";

/**
 * Реализует поддержание состояния Input'а в виртуальном компоненте. только одного.
 */
export class SelectableComponent extends VirtualComponentBase {
    /** @param {TemplateProvider} templateProvider */
    constructor(templateProvider) {
        super();
        this.mirrorStorage = new SelectableInputMirrorStorage();
        this.templateProvider = templateProvider;
    }

    set value(value) { this.mirrorStorage.value = value; }
    get value() { return this.mirrorStorage.value }

    set selected(value) { this.mirrorStorage.selected = value }
    get selected() { return this.mirrorStorage.selected }

    set onInput(callback) { this._mirrorStorage.onInput = callback; }
    get onInput() { return this.mirrorStorage.onInput; }
}