'use strict';

import { SelectableInputComponent } from "../../VirtualComponent/InteractiveHtmlOvner/Input/SelectableInputComponent.js";

/**
 * Компонент "Плашка с индикатором и текстом" квиза.
 */
export class BadgeWithIndicator extends SelectableInputComponent {
    /**
     * @param {string} name
     * @param {HTMLTemplateElement} htmlTemplate
     */
    constructor(name, templateProvider) {
        super(templateProvider);
        this.name = name;
    }

    set name(text) { if (typeof text !== 'string') throw new TypeError(); this.state.name = text; }
    /** @returns {string} */
    get name() { return this.state.name; }

    /**
     * @param {string} data
     * @param {HTMLTemplateElement} htmlTemplate
     */
    static deserializeData(data, htmlTemplate) {
        let card = new this(data, htmlTemplate);
        card.value = data;
        return card;
    }
}