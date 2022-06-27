'use strict';

import { Quiz } from "./Quiz/Quiz.js";
import data from './Quiz/data.js'

console.log(data);
let quiz = new Quiz();
window.quiz = quiz
quiz.deserializeQuizData(data);