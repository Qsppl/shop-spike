'use strict';

class Quiz {
    constructor(questions, scenariosGraph = undefined) {
        this._scenes = new Set();
        for (let questionId in questions) {
            let constructor = VirtualComponent.locateSerializedComponent(questions[questionId]);
            this._scenes.add(constructor.deserializeComponent(questions[questionId]))
        }
    }


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