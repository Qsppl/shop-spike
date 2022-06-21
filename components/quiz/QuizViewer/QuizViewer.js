'use strict';

require('../VirtualComponent/VirtualComponent.js');

class QuizViewer extends VirtualComponent {
    constructor() {
        super();

        let state = this.mirrorStorage;
        // ComponentStates
        state.indicatorCounter = new QuizIndicatorCounter(0, 0);
        state.percentProgress = 0;
        state.beginningCounter = 0;
        state.endCounter = 0;
        state.scenesCount = 0;
        state.responsePicWebp = "";
        state.responsePicPng = "";
    }
}