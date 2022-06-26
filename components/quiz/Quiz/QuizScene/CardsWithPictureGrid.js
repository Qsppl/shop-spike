'use strict';

import { TemplateProvider } from "../../VirtualComponent/TemplateProvider.js";
import { CardWithPicture } from "../UserInputComponent/CardWithPicture.js";
import { QuizScene } from "./QuizScene.js";

/**
 * Сцена квиза с сеткой из selectable карточек.
 */
export class CardsWithPictureGrid extends QuizScene {
    get childComponentTemplate() { return TemplateProvider.findTemplateByName(this.maxSelectedCards > 1 ? 'card-check-with-picture' : 'card-radio-with-picture'); }
    get childComponentConstructor() { return CardWithPicture; }
}