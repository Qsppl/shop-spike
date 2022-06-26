'use strict';

import { SelectableComponentBase } from "./SelectableComponentBase";

export class ISelectableGroupHolder {
    /** @param {string} mode - "radio" || "checkbox" */
    setUserinputMode(mode) {
        this.mode = mode;
        switch (mode) {
            case "radio":
                // Специальное поведение для удержания checked у единственного элемента group
            case "checkbox":
                this._userInputComponent = SelectableComponentBase
                break;
        
            default:
                TypeError("Как?!");
                break;
        }
    }

    /** @param {string} mode - "radio" || "checkbox" */
    set mode(mode) { if (this.mode) throw new Error(); if (mode !== "radio" || mode !== "checkbox") throw TypeError(); this.mode = mode; }
    get mode() { return this.mode; }
}