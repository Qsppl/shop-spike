'use strict';

import { TemplateProvider } from "../../VirtualComponent/TemplateProvider.js";
import { QuizScene } from "./QuizScene.js";
import { BadgeWithIndicator } from "../UserInputComponent/BadgeWithIndicator.js"

/**
 * Сцена квиза с сеткой из selectable плашек с текстом.
 * 
 * Позволяет добавлять новые карточки на сцену и удалять старые. Предоставляет доступ к чтению совокупного пользовательского ввода со всех карточек сцены.
 */
export class BadgeWithIndicatorGrid extends QuizScene {
    get childComponentTemplate() { return TemplateProvider.findTemplateByName(this.maxSelectedCards > 1 ? 'badge-with-check-indicator' : 'badge-with-radio-indicator'); }
    get childComponentConstructor() { return BadgeWithIndicator; }
}