'use strict';

import { VirtualComponent } from "../../VirtualComponent/VirtualComponent.js";
import { SelectableInputGroup } from "../../VirtualComponent/InteractiveHtmlOvner/GroupController/SelectableInputGroup.js";
import { TemplateProvider } from "../../VirtualComponent/TemplateProvider.js";

export class QuizScene extends VirtualComponent {
    /**
     * @param {Number|Array<Number>} amountOfSelect Отрезок на числовой прямой или число - задают необходимое количество ответов.
     * @param {string} title Заголовок сцены.
     * @param {string} subtitle Подзаголовок сцены.
     * @param {HTMLTemplateElement} htmlTemplate по умолчанию равен 'auto'
     */
    constructor(title, subtitle = "", amountOfSelect = 1, htmlTemplate = 'auto') {
        super(TemplateProvider.findTemplateByName('quiz-scene'));
        console.log(`New QuizScene: ${this.constructor.name}! amountOfSelect is ${amountOfSelect}`);

        this._interactiveGroupController = new SelectableInputGroup(amountOfSelect);
        this._nandleInputGroupFill = this._nandleInputGroupFill.bind(this);
        this._interactiveGroupController.onUserFilledField = this._nandleInputGroupFill;
        this.state.title = title;
        this.state.subtitle = subtitle;
    }

    get maxSelectedCards() { return this._interactiveGroupController.maxAmountOfSelect; }

    get childComponentTemplate() { throw new Error(`Интерфейс не был определен в дочернем классе ${this.constructor.name} класса QuizScene`); }
    get childComponentConstructor() { throw new Error(`Интерфейс не был определен в дочернем классе ${this.constructor.name} класса QuizScene`); }

    /**
     * @param {string} idintefer 
     * @param {VirtualComponent} component
     */
    addChildComponent(component) {
        this.appendInSlot(component, "inputs");

        this._interactiveGroupController.addComponent(component);
        if (this._getComponentsInSlot("inputs").length === 1) component.quietlySelect();
    }

    /** @param {IUserInputSource} inputSource  */
    _nandleInputGroupFill(inputSource) { this.onReady(this); }

    /** @returns {Map<String, String|null>} responsData Map<key, value|null> */
    getResponse() { return this._interactiveGroupController.getResponse() }

    onReady() { }

    /**
     * @param {Object} data 
     * @param {HTMLTemplateElement} htmlTemplate по умолчанию равен 'auto'
     */
    static deserializeData(data, htmlTemplate = 'auto') {
        let subtitle = data.subtitle ? data.subtitle : "";
        let scene = new this(data.quest, subtitle, data.amountOfSelect, htmlTemplate);

        // десериализация дочерних компонентов
        for (let answerIdintefer in data.answers) {
            let childComponentData = data.answers[answerIdintefer];
            if (!(scene.childComponentTemplate instanceof HTMLTemplateElement)) throw new TypeError(scene.childComponentTemplate)
            scene.addChildComponent(scene.childComponentConstructor.deserializeData(answerIdintefer, childComponentData, scene.childComponentTemplate));
        }
        return scene;
    }
}