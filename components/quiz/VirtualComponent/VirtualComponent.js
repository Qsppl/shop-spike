'use strict';

import { VirtualComponentBase } from './VirtualComponentBase.js';
import { MirrorStorage } from './MirrorStorage.js';
import { TemplateProvider } from './TemplateProvider.js';
import { kebabize } from '../lib.js';

export class VirtualComponent extends VirtualComponentBase {
    constructor() {
        super();
        this.mirrorStorage = new MirrorStorage();
        this.templateProvider = this._findTemplate();
    }

    _findTemplate() {
        let htmlTemplate = document.getElementById(kebabize(this.constructor.name));
        if (TemplateProvider.validateTemplate(htmlTemplate)) {
            return new TemplateProvider(htmlTemplate);
        }
        return null;
    }
}