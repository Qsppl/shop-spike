'use strict';

import { QuestionViewer } from "./QuestionViewer/QuestionViewer.js";
import { FinalScene } from "./FinalScene/FinalScene.js";

/**
 * Модель и контроллер приложения-теста.
 * 
 * На разных этапах прохождения теста предоставляет следующие представления: QuestionViewer|FinalScene
 * 
 * Исполняет роль единственного источника истины для представлений.
 */
class Quiz {
    constructor()
    _questionViewer = new QuestionViewer();
    _finalScene = new FinalScene();
    _currentView = this._questionViewer;
    spawnView() {}
    removeView() {}

    _quizQuestions = new Set();
    addQuestion() {}

    /**
     * Последовательность пройденых вопросов теста.
     */
    _history = new Set();
    nextQuestion() {}
    prevQuestion() {}
    onQuestionsOver() {}
    resetProgress() {}
}