'use strict';

import { SelectableInputComponent } from "../../VirtualComponent/InteractiveHtmlOvner/Input/SelectableInputComponent.js";

/**
 * Компонент "Карточка с изображением" квиза.
 */
export class CardWithPicture extends SelectableInputComponent {
    /**
     * @param {HTMLTemplateElement} htmlTemplate
     * @param {string} idintefer
     * @param {string} text
     * @param {string} imageUrl
     */
    constructor(htmlTemplate, idintefer, text, imageUrl) {
        super(htmlTemplate, idintefer, text);
        this.url = imageUrl;
        console.log(`   New SelectableInputComponent: ${this.constructor.name}!`);
    }

    set name(text) { if (typeof text !== 'string') throw new TypeError(); this.state.name = text; }
    /** @returns {string} */
    get name() { return this.state.name; }

    set url(url) { if (typeof url !== 'string') throw new TypeError(); this.state.url = url; }
    /** @returns {string} */
    get url() { return this.state.url; }

    /**
     * @param {String} idintefer 
     * @param {Object} data 
     * @param {HTMLTemplateElement} htmlTemplate
     */
    static deserializeData(idintefer, data, htmlTemplate) {
        return new this(htmlTemplate, idintefer, data.text, data.image);
    }
}