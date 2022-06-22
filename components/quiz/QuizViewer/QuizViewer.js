'use strict';

import { VirtualComponent } from '../VirtualComponent/VirtualComponent.js';
import { QuizIndicatorCounter } from '../QuizIndicatorCounter/QuizIndicatorCounter.js';

export class QuizViewer extends VirtualComponent {
    constructor() {
        super();

        this._quizIndicatorComponent = new QuizIndicatorCounter();
        let state = this.mirrorStorage;
        // ComponentStates
        console.log('this._quizIndicatorComponent', this._quizIndicatorComponent);
        state.indicatorCounter = this._quizIndicatorComponent.templateProvider;
        state.percentProgress = '0%';
        state.beginningCounter = 0;
        state.endCounter = 0;
        state.scenesCount = 0;
        state.picPng = "";
        state.picWebp = "";
    }
}