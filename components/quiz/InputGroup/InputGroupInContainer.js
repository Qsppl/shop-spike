'use strict';

import { VirtualComponent } from "../VirtualComponent/VirtualComponent.js";

export class InputGroupInContainer extends VirtualComponent {
    /**
     * @param {} inputs
     */
    constructor(inputs) {
        super();
        this._inputs = new Set();
        for (inputComponent of inputs) this.addInput(inputComponent);
    }

    /**
     * @param {VirtualComponent} inputComponent 
     */
    addInput(inputComponent) { this._inputs.add(inputComponent); return true; }

    createHTML() {
        let html = super.createHTML();
        let slot = html.querySelector(`[component-slot="inputs"]`);
        for (let inputComponent of this._inputs) slot.appendChild(inputComponent.createHTML());

        return html;
    }
}