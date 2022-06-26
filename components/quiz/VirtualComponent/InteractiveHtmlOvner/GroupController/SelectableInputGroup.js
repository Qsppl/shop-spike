'use strict';

import { VirtualComponent } from "../../../VirtualComponent/VirtualComponent.js"
import { SelectableInputComponent } from "../Input/SelectableInputComponent.js";

export class SelectableInputGroup {
    /**  @param {integer|false} maxSelectedCards */
    constructor(maxSelectedCards = false) {
        this.maxSelectedCards = maxSelectedCards;
        this._componentsMap = new Map();
        this._selectedComponents = new Set();
        this._onComponentInput = this._onComponentInput.bind(this);
    }

    /**
     * @param {string} idintefer 
     * @param {SelectableInputComponent} component 
     */
    addComponent(idintefer, component) {
        if (!(component instanceof VirtualComponent)) throw new TypeError();
        this._componentsMap.set(idintefer, component);
        component.addInputListener(this._onComponentInput);
        if (component.checked) this.addSelectedComponent(component);
    }

    getValueOfGroup() {
        value = new Map();
        for (let [key, component] of this._componentsMap) { if (component.checked) value.set(key, component.value); }

        return value;
    }

    /**  @param {SelectableInputComponent} component  */
    _onComponentInput(component) { component.checked ? this.addSelectedComponent(component) : this.removeSelectedComponent(component); }

    /**  @param {SelectableInputComponent} component  */
    removeSelectedComponent(component) {
        if (!this._selectedComponents.has(component)) return true;
        if (component.checked) component.checked = false;
        this._selectedComponents.delete(component);
    }

    /**  @param {SelectableInputComponent} component  */
    addSelectedComponent(component) {
        if (this._selectedComponents.has(component)) return true;
        if (!component.checked) component.checked = true;
        while (this._selectedComponents.size >= this.maxSelectedCards) {
            let last = Array.from(this._selectedComponents).pop();
            last.checked = false;
            this._selectedComponents.delete(last);
        }
        this._selectedComponents.add(component);
    }
}