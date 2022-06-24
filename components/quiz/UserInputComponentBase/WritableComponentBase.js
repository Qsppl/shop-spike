'use strict';

import { VirtualComponentBase } from "../VirtualComponent/VirtualComponentBase.js";
import { WritableInputMirrorStorage } from "../VirtualComponent/InputMirrorStorage.js";

/**
 * Реализует поддержание состояния Input'а в виртуальном компоненте. только одного.
 */
export class WritableComponentBase extends VirtualComponentBase {
    /** @param {TemplateProvider} templateProvider */
    constructor(templateProvider) {
        super();
        this.mirrorStorage = new WritableInputMirrorStorage();
        this.templateProvider = templateProvider;
    }

    set value(value) { this.mirrorStorage.value = value; }
    get value() { return this.mirrorStorage.value }

    set onInput(callback) { this._mirrorStorage.onInput = callback; }
    get onInput() { return this.mirrorStorage.onInput; }
}