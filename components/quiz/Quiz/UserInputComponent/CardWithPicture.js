'use strict';

import { SelectableInputComponent } from "../../VirtualComponent/InteractiveHtmlOvner/Input/SelectableInputComponent.js";

/**
 * Компонент "Карточка с изображением" квиза.
 */
export class CardWithPicture extends SelectableInputComponent {
    /**
     * @param {string} name
     * @param {string} url
     * @param {HTMLTemplateElement} htmlTemplate
     */
    constructor(name, url, templateProvider) {
        super(templateProvider);
        this.name = name;
        this.url = url;
    }

    set name(text) { if (typeof text !== 'string') throw new TypeError(); this.state.name = text; }
    /** @returns {string} */
    get name() { return this.state.name; }

    set url(url) { if (typeof text !== 'string') throw new TypeError(); this.state.url = url; }
    /** @returns {string} */
    get url() { return this.state.url; }

    /**
     * @param {Object} data 
     * @param {HTMLTemplateElement} htmlTemplate
     */
    static deserializeData(data, htmlTemplate) {
        let card = new this(data.text, data.image, htmlTemplate);
        card.value = data.text;
        return card;
    }
}