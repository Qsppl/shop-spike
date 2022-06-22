'use strict';

import { VirtualComponentBase } from "../VirtualComponent/VirtualComponent";

export class Input extends VirtualComponentBase {
    set templateProvider(templateProvider) {
        super.templateProvider = templateProvider;
        templateProvider.addAfterSpawnListener(this.spawnInputsInSelfTemplate);
    }
    getValue() {}
    onInput() {}
}