'use strict';

import { VirtualComponent } from "../../VirtualComponent/VirtualComponent";

class InputGroup extends VirtualComponent {
    constructor() {
        super();

        this._inputs = new Set();
        this.spawnInputs = this.spawnInputs.bind(this);
        this.inputsSlotName = 'inputs';
    }

    set templateProvider(templateProvider) {
        super.templateProvider = templateProvider;
        templateProvider.addAfterSpawnListener(this.spawnInputsInSelfTemplate);
    }
    
    spawnInputs(root) {
        let slot = root.querySelector(`[component-slot="${this.inputsSlotName}"]`);
        for (let inputComponent of this.inputs) inputComponent.spawnTemplateIn(slot, false);
    }
}