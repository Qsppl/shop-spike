'use strict';

import { QuestionViewer } from "./QuestionViewer/QuestionViewer.js";
import { FinalScene } from "./FinalScene/FinalScene.js";
import { VirtualComponent } from "../VirtualComponent/VirtualComponent.js";
import { SelectableComponent } from "../UserInputListener/SelectableComponent.js";
import { WritableComponent } from "../UserInputListener/WritableComponent.js";

/**
 * Модель и контроллер приложения-теста.
 * 
 * На разных этапах прохождения теста предоставляет следующие представления: QuestionViewer|FinalScene
 * 
 * Исполняет роль единственного источника истины для представлений.
 */
class Quiz {
    constructor() {
        this._questionViewer = new QuestionViewer();
        this._finalScene = new FinalScene();

        this._quizQuestionsMap = new Map();
        this._history = new Set();

        this._startQuestionReaderMode()
    }

    /**
     * @param {VirtualComponent} view
     */
    set currentView(view) { this.currentView = view }
    get currentView() { return this.currentView }

    spawnViewIn(slot) { this.currentView.templateProvider.spawnTemplateIn(slot) }
    removeView() { this.currentView.remove }

    addQuestionScene(title, innerComponents, subtitle = '') { }

    _startQuestionReaderMode() {
        let questionViewer = this._questionViewer;
        this.currentView = this._questionViewer;

        questionViewer.setScene()
    }

    /** Последовательность пройденых вопросов теста. */
    nextQuestion() { }
    prevQuestion() { }
    onQuestionsOver() { }
    resetProgress() { }

    deserializeQuizData(data) {
        let scenesList = [];
        for (let questionId in data.questions) {
            let questionData = data.questions[questionId];

            // Создаем компонент-сцену
            let scene = new QuizScene();
            if (questionData.mode === "checkbox") scene.singleSelectMode();

            // Заполняем
            scene.state.title = questionData.quest;

            
            // Создаем дочерние интерактивные элементы
            // Ищем шаблон интерактивных элементов
            let htmlTemplate = document.getElementById(questionData.component);
            if (TemplateProvider.validateTemplate(htmlTemplate)) {
                templateProvider = new TemplateProvider(htmlTemplate);
            }

            let component;
            if (htmlTemplate.querySelector('[type="radio"], [type="checkbox"]')) component = SelectableComponent;
            else component = WritableComponent;

            let list = questionData.answers;
            for (let answerId in list) scene.addInputComponent(answerId, new component(templateProvider, list[answerId]));

            scenesList.push(scene);
        }
    }
}