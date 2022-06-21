'use strict'

let config = require('./data.json');


function readQuestionScenes(serializedVirtualComponents) {
    let quizQuestionScenes = [];
    for (let componentId in serializedVirtualComponents) {}
}

function readScenarios(scenariosData) {
    let scenarios;
    for (let scenario of scenariosData) {

    }
}

let quiz = new Quiz(readConfig(config))

// class QuizIndicatorCounter extends VirtualComponent {
//     constructor(quizViewerTemplate) {
//         super(quizViewerTemplate);
//     }

//     maxValue = 1;
//     /**
//      * @param {Number} number
//      */
//     set maxValue(number) { this.maxValue = number; this.render(); }

//     currentValue = 1;
//     /**
//      * @param {Number} number
//      */
//     set currentValue(number) { this.currentValue = number; this.render(); }
// }

// let data = {
//     "scenarios": {
//         "main": ["qst1", "qst2", "qst3", "sn4", "sn5", "sn6", "sn7"],
//         "@Any.qst1.ans5": ["snFoundation", "snWicket", "snFacade", "@Parent.sn5"],
//         "@Any.qst1.ans2": ["qst2", "snWicket", "snFacade", "@Parent.sn5"]
//     },
//     "questions": {
//         "qst1": {
//             "type": "radio",
//             "view": "textGrid",
//             "question": "Чи да?",
//             "answers": {
//                 "ans1": "да",
//                 "ans2": "нет",
//                 "ans3": "пизда"
//             }
//         },
//         "qst2": {
//             "type": "radio",
//             "view": "cardsGrid",
//             "question": "Какие ворота Вас интересуют?",
//             "answers": {
//                 "ans1": { "text": "Откатные", "image": "" },
//                 "ans2": { "text": "Распашные", "image": "" },
//                 "ans3": { "text": "Секционно-подъёмные", "image": "" },
//                 "ans4": { "text": "Рулонные", "image": "" },
//                 "ans5": { "text": "Рольставни", "image": "" },
//                 "ans6": { "text": "Другое", "image": "" }
//             }
//         },
//         "qst3": {
//             "type": "radio",
//             "view": "textGrid",
//             "question": "Куда нужны ворота?",
//             "answers": {
//                 "ans1": "Частный дом",
//                 "ans2": "Дача",
//                 "ans3": "Многоквартирный дом",
//                 "ans4": "Промышленный объект"
//             }
//         }
//     }
// }