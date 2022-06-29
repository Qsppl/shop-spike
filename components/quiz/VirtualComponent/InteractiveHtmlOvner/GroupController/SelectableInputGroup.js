'use strict';

import { VirtualComponent } from "../../../VirtualComponent/VirtualComponent.js"
import { SelectableInputComponent } from "../Input/SelectableInputComponent.js";

export class SelectableInputGroup {
    /** @param {Number|Array<Number, Number>} amountOfSelect Отрезок на числовой прямой или число - задают необходимое количество ответов. */
    constructor(amountOfSelect = 1) {
        if (typeof amountOfSelect === 'number') {
            this._minAmountOfSelect = amountOfSelect;
            this._maxAmountOfSelect = amountOfSelect;
        } else if (amountOfSelect instanceof Array) {
            console.log(amountOfSelect);
            if (typeof amountOfSelect[0] !== 'number' || typeof amountOfSelect[1] !== 'number') throw new TypeError();
            this._minAmountOfSelect = amountOfSelect[0];
            this._maxAmountOfSelect = amountOfSelect[1];
        } else throw new TypeError();

        this.__componentsMap = new Map();
        this._onComponentInput = this._onComponentInput.bind(this);
    }

    /** @returns {Set<SelectableInputComponent>} */
    get _selectedComponents() { return new Set([...this._componentsMap.values()].filter((component) => { return component._mirrorStorage._checked; })); }
    /** @returns {Map<SelectableInputComponent>} */
    get _componentsMap() { return this.__componentsMap; }

    /** @returns {Number} */
    get minAmountOfSelect() { return this._minAmountOfSelect; }
    /** @returns {Number} */
    get maxAmountOfSelect() { if (isFinite(this._maxAmountOfSelect)) return this._maxAmountOfSelect; else { return this._componentsMap.size > 2 ? this._componentsMap.size : this._maxAmountOfSelect; } }

    /**
     * @param {string} idintefer 
     * @param {SelectableInputComponent} component 
     */
    addComponent(idintefer, component) {
        if (!(component instanceof SelectableInputComponent)) throw new TypeError();
        this._componentsMap.set(idintefer, component);
        component.onUserFilledField = this._onComponentInput;
        console.log(`   addComponent ${component}`);
        if (component.checked) this._addToGroupOfSelected(component);
    }

    /**  @param {SelectableInputComponent} component  */
    _onComponentInput(component) { this._normalizeGroup(component); }

    /**  @param {SelectableInputComponent} component  */
    _normalizeGroup(changedComponent) {
        let selected = Array.from(this._selectedComponents);
        if (this.maxAmountOfSelect === 0) for (let component of selected) component._mirrorStorage._checked = false;

        // radio mode
        if (this.minAmountOfSelect === 1 && this.maxAmountOfSelect === 1) {
            for (let component of selected) component._mirrorStorage._checked = false;
            changedComponent._mirrorStorage._checked = true;
        } else if (this.maxAmountOfSelect === 1) {
            for (let component of selected) {
                if (component === changedComponent) continue;
                component._mirrorStorage._checked = false;
            }
        } else if (this.maxAmountOfSelect > 1) {
            if (changedComponent._mirrorStorage._checked === false) return;
            if (selected.length > this.maxAmountOfSelect) changedComponent._mirrorStorage._checked = false;
            selected = Array.from(this._selectedComponents);
            while (selected.length > this.maxAmountOfSelect) selected.pop()._mirrorStorage._checked = false;
        }

        Array.from(this._componentsMap.values()).map((component) => { component.state.render(); })
    }

    // ### IUserInputSource ###

    // getValueOfGroup() {
    //     value = new Map();
    //     for (let [key, component] of this._componentsMap) { if (component._mirrorStorage._checked) value.set(key, component.value); }
    //     if (value.size < this.maxAmountOfSelect) return false;
    //     return value;
    // }

    /**
     * Сюда присваивается callback - вызовется когда интерактивный компонент посчитает что пользователь передал какую-то часть конечных данных. Сам не определяет подходят ли эти данные;
     * @param {IUserInputSource}
     */
    onUserFilledField(inputSource) { }

    /** @returns {Set<String, String>|Set<null, null>} Set<key, value>|Set<null, null> */
    getResponse() {
        if (this._selectedComponents.size < this._maxAmountOfSelect) return new Set([null, null]);
        
        for (let component of this._selectedComponents.values)
        if (typeof this.name !== 'string' || typeof this.value !== 'string') return new Set([null, null]);
        return new Set([this.name, this.value]);
    }

    // ### /IUserInputSource ###
}