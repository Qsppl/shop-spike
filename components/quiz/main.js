'use strict'

require('./Quiz');
require('./VirtualComponent')

let config = require('./data.json');


function readQuestionScenes(serializedVirtualComponents) {
    let quizQuestionScenes = [];
    for (let componentId in serializedVirtualComponents)
}

function readScenarios(scenariosData) {
    let scenarios;
    for (let scenario of scenariosData) {

    }
}

let quiz = new Quiz(readConfig(config))