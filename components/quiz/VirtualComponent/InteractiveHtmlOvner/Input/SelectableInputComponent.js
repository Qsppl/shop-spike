'use strict';

import { MirrorStorage } from "../../MirrorStorage.js";
import { VirtualComponent } from "../../VirtualComponent.js";

/**
 * Хранение хранение и отражение свойств value и secect элемента input.
 * Перехват пользовательского "выбора" интерактивного элемента
 */
class SelectableInputMirrorStorage extends MirrorStorage {
    /** @param {HTMLTemplateElement} template */
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
        this._checked = false;
        this._handleClickEvent = this._handleClickEvent.bind(this);
        this._allowedTypes = new Set(['checkbox', 'radio']);
    }

    onInputChanged() { }

    /** @returns {SelectableInputMirrorStorage} Прокси для доступа к свойствам хранилища. При записи через прокси свойства будут зеркально отображены в разметку. */
    // это не storage. объект MirrorStorage это storage - а прокси осуществляет доступ к storage с автоматической синхронизацией разметки.
    get storage() { return super.storage; }

    _handleClickEvent(e) { this.storage.checked = !(this.storage.checked); this.onInputChanged(); }

    // этот костыль блокирует доступ из js - надо перенести в state все эвент-таргеты
    set checked(state) { this._checked = state; }

    /** @returns {boolean} */
    get checked() { return this._checked; }

    /**
     * Применить состояние хранилища к разметке
     * @param {HTMLElement} rootElement - корневой элемент HTML разметки компонента.
     */
    attach(rootElement) {
        super.attach(rootElement);

        this._input = rootElement.querySelector('input');
        if (!(this._input instanceof HTMLInputElement)) throw new Error();
        if (!(this._allowedTypes.has(this._input.type))) throw new Error();
        this._input.addEventListener('click', this._handleClickEvent);

        if (this.checked !== undefined) this._input.checked = this.checked;
        else this.checked = this._input.checked;

        if (this.value) this._input.value = this.value;
        else if (this._input.value) this.value = this._input.value;
    }

    render(rootElement = this._rootElement) {
        if (!super.render(rootElement)) return false;

        this._input.value = this.value;
        this._input.checked = this.checked;
        return true;
    }
}

/**
 * Реализует поддержание состояния Input'а в виртуальном компоненте. только одного.
 */
export class SelectableInputComponent extends VirtualComponent {
    /** @param {HTMLTemplateElement} template */
    constructor(template, name, value) {
        super(template);
        this._inputSelectHandler = this._inputSelectHandler.bind(this);
        this._mirrorStorage = new SelectableInputMirrorStorage(name, value);
        this._mirrorStorage.onInputChanged = this._inputSelectHandler;
    }

    _inputSelectHandler() {
        this.onInputChanged(this);
        if (this.checked) this.onUserFilledField(this);
    }

    /** @param {SelectableInputComponent} component */
    onInputChanged(component) { }

    /** @returns {SelectableInputMirrorStorage} */
    get state() { return this._mirrorStorage.storage; }

    set checked(state) { this.state.checked = state; }
    /** @returns {boolean} value */
    get checked() { return this.state.checked; }

    quietlySelect() {
        this.checked = true;
    }

    // ### IUserInputSource ###

    /**
     * callback - вызовется когда интерактивный компонент посчитает что пользователь передал какую-то часть конечных данных. Сам не определяет подходят ли эти данные;
     * @param {IUserInputSource}
     */
    onUserFilledField(inputSource) { }

    set name(string) { this.state.name = string; }
    /** @returns {string} value */
    get name() { return this.state.name; }

    set value(string) { this.state.value = string; }
    /** @returns {string} value */
    get value() { return this.state.value; }

    /** @returns {Map<String, String|null>} Map<name, value|null> */
    getResponse() {
        if (typeof this.name !== 'string' || typeof this.value !== 'string') return new Map([[this.name, null]]);
        if (!this.checked) return new Map([[this.name, null]]);
        return new Map([[this.name, this.value]]);
    }

    // ### /IUserInputSource ###
}