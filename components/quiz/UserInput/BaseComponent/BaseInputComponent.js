'use strict';

import { VirtualComponentBase } from "../../VirtualComponent/VirtualComponentBase";

export class BaseInputComponent extends VirtualComponentBase {
    /** @param {TemplateProvider} templateProvider */
    constructor(templateProvider) {
        super();
        this.mirrorStorage = new WritableInputMirrorStorage();
        this.templateProvider = templateProvider;
    }
}