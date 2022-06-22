'use strict';

/**
 * Модель и контроллер приложения-теста.
 * 
 * На разных этапах прохождения теста предоставляет следующие представления: QuestionViewer|FinalScene
 * 
 * Исполняет роль единственного источника истины для представлений.
 */
class Quiz {
    constructor(questions, scenariosGraph = undefined) {
        this._scenes = new Set();
        for (let questionId in questions) {
            let constructor = VirtualComponent.locateSerializedComponent(questions[questionId]);
            this._scenes.add(constructor.deserializeComponent(questions[questionId]))
        }
    }

    addScene() {}



    /**
     * Десериализует карту сцен квиза.
     * @param {*} questionsData 
     * @returns {Object} questionsMap {sceneId: QuizQuestionScene, ...} 
     */
    deserealizeQuestionsMap(questionsData) {
        let questionsMap = {};
        for (let questionId in questionsData) {
            let constructor = QuizQuestionScene.locateSerializedComponent(questionsData);
            let quizQuestionScene = new QuizQuestionScene.deserealize(questionsData);
        }
    }
}

class QuizQuestionScene {

}

var quiz = new Quiz(data.questions, data.scenarios)