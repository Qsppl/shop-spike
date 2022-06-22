'use strict';

import { MirrorStorage } from "./MirrorStorage";

class UserInputMirrorStorage extends MirrorStorage {
    constructor() {
        super()
    }

    render(rootNode = this._rootElement) {
        if (!super.render(rootElement)) return false;

        let changedInputs = new Set(rootElement.querySelectorAll('input[type="checkbox"], input[type="radio"], select'));
        for (let element of changedInputs) {
            element.addEventListener('change', function (e) {
                something(this.value);
            });
        }

        let inputedInputs = rootElement.querySelectorAll('input, textarea')
        for (let element of inputedInputs) {
            if (changedInputs.has(element)) continue;
            element.addEventListener('change', function (e) {
                something(this.value);
            });
        }
    }
}