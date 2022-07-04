'use strict';

import { IUserInputSource } from "../IUserInputSource.js";
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

        this._attachedInputs = new Set();
        this._handleInputChange = this._handleInputChange.bind(this);
    }

    /** @returns {Set<SelectableInputComponent>} */
    get _selectedComponents() {
        return new Set([...this.attachedInputs].filter((component) => { return component._mirrorStorage._checked; }));
    }
    /** @returns {Map<SelectableInputComponent>} */
    get attachedInputs() { return this._attachedInputs; }

    /** @returns {Number} */
    get minAmountOfSelect() { return this._minAmountOfSelect; }
    /** @returns {Number} */
    get maxAmountOfSelect() {
        if (isFinite(this._maxAmountOfSelect)) return this._maxAmountOfSelect;
        else { return this.attachedInputs.size > 2 ? this.attachedInputs.size : this._maxAmountOfSelect; }
    }

    /** @param {SelectableInputComponent} component */
    _handleInputChange(component) {
        this._normalizeGroup(component);
        if (this._selectedComponents.size === this.maxAmountOfSelect) this.onUserFilledField(this);
    }

    /**
     * @param {string} idintefer 
     * @param {SelectableInputComponent} component 
     */
    addComponent(component) {
        if (!(component instanceof SelectableInputComponent)) throw new TypeError(component);
        if (this.attachedInputs.has(component)) return;
        
        this.attachedInputs.add(component);
        component.onInputChanged = this._handleInputChange;
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

        Array.from(this.attachedInputs.values()).map((component) => { component.state.render(); })
    }

    // ### IUserInputSource ###

    /**
     * Сюда присваивается callback - вызовется когда интерактивный компонент посчитает что пользователь передал какую-то часть конечных данных. Сам не определяет подходят ли эти данные;
     * @param {IUserInputSource} inputSource
     */
    onUserFilledField(inputSource) {
        console.log('go, ', inputSource.getResponse());
    }

    /** @returns {Map<String, String|null>} Map<key, value|null> */
    getResponse() {
        let response = new Map("", null);
        if (this._selectedComponents.size < this._minAmountOfSelect) return response;

        for (let component of this._selectedComponents)
            for (let [name, value] of component.getResponse().entries()) response.set(name, value);
        return response;
    }

    // ### /IUserInputSource ###
}