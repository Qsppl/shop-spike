'use strict';

import { SelectableInputComponent } from "../../VirtualComponent/InteractiveHtmlOvner/Input/SelectableInputComponent.js";

/**
 * Компонент "Плашка с индикатором и текстом" квиза.
 */
export class BadgeWithIndicator extends SelectableInputComponent {
    /**
     * @param {HTMLTemplateElement} htmlTemplate
     * @param {string} idintefer
     * @param {string} text
     */
    constructor(htmlTemplate, idintefer, text) {
        super(htmlTemplate, idintefer, text);
    }

    set name(text) { if (typeof text !== 'string') throw new TypeError(); this.state.name = text; }
    /** @returns {string} */
    get name() { return this.state.name; }

    /**
     * @param {String} idintefer 
     * @param {Object} data 
     * @param {HTMLTemplateElement} htmlTemplate
     */
    static deserializeData(idintefer, data, htmlTemplate) {
        return new this(htmlTemplate, idintefer, data);
    }
}