'use strict';

import { VirtualComponentBase } from "../../VirtualComponent/VirtualComponent";

export class InputGroupSpawner extends VirtualComponentBase {
    constructor() {
        super();

        this._inputs = new Set();
    }


    spawnTemplateIn(slot, rewrite = true) {
        this.spawnInputs(slot);
        return slot;
    }
    
    spawnInputs(slot) {
        for (let inputComponent of this.inputs) inputComponent.spawnTemplateIn(slot, false);
    }
}