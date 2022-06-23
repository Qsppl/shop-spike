'use strict';

import { VirtualComponentBase } from "../VirtualComponent/VirtualComponent.js";

export class InputGroupSpawner extends VirtualComponentBase {
    constructor() {
        super();

        this._inputs = new Set();
    }


    spawnTemplateIn(slot, rewrite = true) {
        this._spawnInputs(slot);
        return slot;
    }
    
    _spawnInputs(slot) {
        for (let inputComponent of this.inputs) inputComponent.spawnTemplateIn(slot, false);
    }
}