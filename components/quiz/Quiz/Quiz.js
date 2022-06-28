'use strict';

import { VirtualComponent } from "../VirtualComponent/VirtualComponent.js";
// Представления
import { QuestionViewer } from "./QuizView/QuestionViewer/QuestionViewer.js";
import { FinalScene } from "./QuizView/FinalScene/FinalScene.js"
// Сцены
import { BadgeWithIndicatorGrid } from "./QuizScene/BadgeWithIndicatorGrid.js";
import { CardsWithPictureGrid } from "./QuizScene/CardsWithPictureGrid.js";
import { QuizScene } from "./QuizScene/QuizScene.js";

/**
 * Модель и контроллер приложения-теста.
 * 
 * На разных этапах прохождения теста предоставляет следующие представления: QuestionViewer|FinalScene
 * 
 * Исполняет роль единственного источника истины для представлений.
 */
export class Quiz {
    constructor() {
        this._questionViewer = new QuestionViewer();
        // this._finalScene = new FinalScene();
        this._view = undefined;
        this._slot = document.querySelector('[component-slot="quiz"]');
        if (this._slot === null) throw new TypeError();
        this._isOpened = false;

        this._scenesMap = new Map();
        this._scenarioTravesabler = new ScenarioTravesabler();
        this._mode = null;
    }

    open() {
        if (this._mode === null) this._startQuestionReaderMode();
        this._slot.innerHTML = "";
        this._slot.appendChild(this._view._html);
        this._isOpened = true;
    }

    close() {
        this._slot.innerHTML = "";
        this._isOpened = false;
    }

    set _view(view) {
        this.__view = view;
        if (this._isOpened) {
            this._slot.innerHTML = "";
            this._slot.appendChild(this._view._html);
        }
    }
    /** @returns {VirtualComponent} _view */
    get _view() { return this.__view }

    _startQuestionReaderMode() {
        this._mode = "questionRead";
        this._view = this._questionViewer;
        this._questionViewer.setScene(this._scenesMap.get(this._scenarioTravesabler.currentScene));
    }

    /** Последовательность пройденых вопросов теста. */
    nextQuestion() {
        let currentSceneId = this._scenarioTravesabler.currentScene;
        let correntScene = this._scenesMap.get(currentSceneId);
        if (!correntScene.value) return false;
        let nextSceneId = this._scenarioTravesabler.next(correntScene.value);
        if (sceneId === false) {
            this.onQuestionsOver();
            return false;
        }
        let nextScene = this._scenesMap.get(nextSceneId);
        this._questionViewer.setScene(nextScene);
    }
    prevQuestion() {
        let sceneId = this._scenarioTravesabler.prev();
        if (sceneId === false) return false;
        let scene = this._scenesMap.get(sceneId);
        this._questionViewer.setScene(scene);
    }
    onQuestionsOver() {
        // this._view = this._finalScene;
    }
    resetProgress() { }

    deserializeQuizData(data) {
        console.log('data.questions is ', data.questions);
        for (let questionId in data.questions) {
            let questionData = data.questions[questionId];
            let scene;
            console.log(data.scene);
            switch (questionData.scene) {
                case "BadgeWithIndicatorGrid":
                    scene = BadgeWithIndicatorGrid.deserializeData(questionData);
                    break;
                case "CardsWithPictureGrid":
                    scene = CardsWithPictureGrid.deserializeData(questionData);
                    break;
                default:
                    throw TypeError();
                    break;
            }
            this._scenesMap.set(questionId, scene);
        }
    }
}

class ScenarioTravesabler {
    constructor() {
        this._scenariosMap = new Map([
            ["main", ["1", "selectGatesType", "3", "4", "5", "6", "7"]],
            ["two", ["snFoundation", "snWicket", "snFacade", "#Parent.5"]],
            ["three", ["snWicket", "snFacade", "#Parent.5"]]
        ]);
        this._path = [];
        this.toScenario("main");
    }

    toScenario(scenarioId) {
        let firstOfScenario = this._scenariosMap.get(scenarioId)[0];
        this._path.push([scenarioId, [firstOfScenario]]);
        this._currentScenarioId = scenarioId;
    }

    get currentScene() {
        window.temp11 = this._path;
        let lastSegment = this._path[this._path.length - 1][1];
        return lastSegment[lastSegment.length - 1];
    }

    next(value) {
        let currentScenario = this._scenariosMap.get(this._currentScenarioId);
        let nextInScenario = currentScenario[++currentScenario.indexOf(this.currentScene)];

        // сценарий закончился. запрещаем выходить из сценария потому что некуда)
        if (nextInScenario == undefined) return false;

        let lastSegment = this._path[this._path.length - 1][1];
        lastSegment.push(nextInScenario);
        return this.currentScene;
    }
    prev() {
        let lastSegment = this._path[this._path.length - 1][1];

        // запрещаем выходить из первой сцены первого отрезка потому что некуда)
        if ((this._path.length = 1) && (lastSegment.length == 1)) return false;

        lastSegment.pop();
        if (lastSegment.length == 0) {
            // если в последнем отрезке закончились сцены, надо вернуться к предыдущему сценарию
            this._path.pop();
            this._currentScenarioId = this._path[this._path.length - 1][0];
        }
        return this.currentScene;
    }
}