'use strict';

import { VirtualComponent } from "../../VirtualComponent/VirtualComponent.js";
import { SelectableInputGroup } from "../../VirtualComponent/InteractiveHtmlOvner/GroupController/SelectableInputGroup.js";
import { TemplateProvider } from "../../VirtualComponent/TemplateProvider.js";

export class QuizScene extends VirtualComponent {
    /**
     * @param {Number|false} maxSelectedCards Максимальное количество одновременно выбранных карточек на сцене. Если false то неограниченно.
     * @param {string} title Заголовок сцены.
     * @param {string} subtitle Подзаголовок сцены.
     * @param {HTMLTemplateElement} htmlTemplate по умолчанию равен 'auto'
     */
    constructor(title, subtitle = "", maxSelectedCards = false, htmlTemplate = 'auto') {
        super(TemplateProvider.findTemplateByName('quiz-scene'));

        this._interactiveGroupController = new SelectableInputGroup();
        this.maxSelectedCards = maxSelectedCards;
        this.state.title = title;
        this.state.subtitle = subtitle;
    }

    get childComponentTemplate() { }
    get childComponentConstructor() { }

    /**
     * @param {string} idintefer 
     * @param {VirtualComponent} component
     */
    addChildComponent(idintefer, component) {
        this.appendInSlot(component, "inputs");

        this._interactiveGroupController.addComponent(idintefer, component);
        if (this._getComponentsInSlot("inputs").length === 1) component.checked = true;
    }

    /**
     * Метод получения введенных пользователем данных с интерактивных компонентов и групп интерактивных компонентов пренадлежащим компоненту
     * @returns 
     */
    getValue() { return this._interactiveGroupController.getValueOfGroup(); }

    /**
     * @param {Object} data 
     * @param {HTMLTemplateElement} htmlTemplate по умолчанию равен 'auto'
     */
    static deserializeData(data, htmlTemplate = 'auto') {
        let subtitle = data.subtitle ? data.subtitle : "";
        let scene = new this(data.quest, subtitle, data.maxSelectItems, htmlTemplate);

        // десериализация дочерних компонентов
        for (let answerIdintefer in data.answers) {
            let childComponentData = data.answers[answerIdintefer];
            if (!(scene.childComponentTemplate instanceof HTMLTemplateElement)) throw new TypeError(scene.childComponentTemplate)
            scene.addChildComponent(answerIdintefer, scene.childComponentConstructor.deserializeData(childComponentData, scene.childComponentTemplate));
        }
        return scene;
    }
}