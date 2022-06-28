'use strict';

import { VirtualComponent } from '../../../VirtualComponent/VirtualComponent.js';
import { IndicatorCounter } from './IndicatorCounter/IndicatorCounter.js';

export class QuestionViewer extends VirtualComponent {
    constructor() {
        super();

        this._quizIndicatorComponent = new IndicatorCounter();
        let state = this.state;
        state.percentProgress = '0%';
        state.beginningCounter = 0;
        state.endCounter = 0;
        state.scenesCount = 0;
        state.picPng = "";
        state.picWebp = "";
    }

    /** @param {VirtualComponent} questionScene */
    setScene(questionScene) {
        if (!(questionScene instanceof VirtualComponent)) throw new TypeError(`${questionScene}`);
        this.clearSlot('question-scene');
        this.appendInSlot(questionScene, "question-scene");
    }
}