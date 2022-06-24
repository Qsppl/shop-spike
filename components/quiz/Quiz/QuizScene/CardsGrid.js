'use strict';

import { QuizScene } from "./QuizScene.js";

export class CardsGrid extends QuizScene {
    /** @param {CardDataType} cardsData */
    constructor(cardsData, mode, title, subtitle = "") {
        if (!(cardsData instanceof CardDataType)) throw TypeError;
        this._mode = mode
        for (let cardData of cardsData) this.addCard(cardData);
    }

    /** @param {CardDataType} cardData */
    addCard(cardData) {
        cardData.name
    }
}

/**
 * Данные карточки квиза.
 * @prop {string} name
 * @prop {string} url
 */
export class CardDataType {
    /** @param {string} name  @param {string} url */
    constructor(name, url) { this.name = name; this.url = url; }
    /** @param {string} text */
    set name(text) { if (typeof text !== 'string') throw new TypeError(); this.name = text; }
    /** @returns {string} */
    get name() { return this.name; }

    /** @param {string} text */
    set url(url) { if (typeof text !== 'string') throw new TypeError(); this.url = url; }
    /** @returns {string} */
    get url() { return this.url; }
}

