class TemplateProvider {
    /**
     * @param {HTMLTemplateElement} template 
     */
    constructor(template) {
        this._template = template;
        this._listenerCreators = new Set();
    }

    /**
     * @param {HTMLTemplateElement} template 
     * @returns {boolean}
     */
    static validateTemplate(template) {
        if (!('content' in document.createElement('template'))) {
            console.log("Браузер не поддерживает <template>");
            return false;
        }
        if (!('content' in template)) return false;
        return true;
    }

    _createHTML() {
        return this._template.content.cloneNode(true);
    }

    /**
     * @param {Element} element 
     */
    spawnTemplateIn(element) {
        element.appendChild(this._createHTML());
        this._engageActiveElements(element);
        return element;
    }

    /**
     * @param {Element} element 
     */
    _engageActiveElements(element) {
        this.onSpawn()(element);
        this.applyStateSource(element);
    }

    /**
     * Spawn callback
     * 
     * @param {Element} element 
     */
    onSpawn(element) { }
}


/**
 * Играет роль единственного источника истины для активных элементов в DOM дереве. 
 * Предоставляет набор публичных полей для управления DOMElement'ами пренадлежащими компоненту.
 * Синхронизирует собственное состояние с элементами в DOM дереве при каждом изменении состояний. 
 * 
 * Поддерживает сохранение состояния при удалении и восстановлении элементов из DOM дерева. 
 */
class VirtualComponent {
    /**
     * @param {string} type 
     * @param {string} view 
     * @param {string} question 
     * @param {Object} answers 
     */
    constructor(template) {
        this.addComponent = this.addComponent.bind(this);
        this._templateProvider = new TemplateProvider(template, this.addComponent)
    }

    /**
     * @param {Element} rootOfComponent
     */
    addComponent(rootOfComponent) {
        if (!(rootOfComponent instanceof Element)) throw new TypeError(`${rootOfComponent} is not Element!`)
        if (this._rootOfComponent !== undefined) {
            console.warn('Попытка переопределить набор элементов хранилища состояния не удалив предыдущий набор элементов!');
            return false;
        }
        this._rootOfComponent = rootOfComponent;
        this.render(this._rootOfComponent);
        return true;
    }

    /**
     * @param {Element} rootOfComponent
     */
    render(rootOfComponent) {

    }


    /**
     * @param {Object} virtualComponentData
     * @returns {QuizQuestionModel}
     */
    static deserialize(virtualComponentData) {
        switch (virtualComponentData.type) {
            case "quizViewer":
                return new QiizViewer()
                break;

            default:
                break;
        }
        return new VirtualComponent(virtualComponentData.type, virtualComponentData.view, virtualComponentData.question, virtualComponentData.answers)
    }
}

class QuizIndicatorCounter extends VirtualComponent {
    constructor(quizViewerTemplate) {
        super(quizViewerTemplate);
    }

    maxValue = 1;
    /**
     * @param {Number} number
     */
    set maxValue(number) { this.maxValue = number; this.render(); }

    currentValue = 1;
    /**
     * @param {Number} number
     */
    set currentValue(number) { this.currentValue = number; this.render(); }
}

class quizViewer extends VirtualComponent {
    constructor(quizViewerTemplate) {
        super(quizViewerTemplate);
    }

    // ComponentStates
    indicatorCounter = new QuizIndicatorCounter(0, 0);
    percentProgress = 0;
    beginningCounter = 0;
    endCounter = 0;
    scenesCount = 0;
    responsePicWebp = "";
    responsePicPng = "";
}

let data = {
    "scenarios": {
        "main": ["qst1", "qst2", "qst3", "sn4", "sn5", "sn6", "sn7"],
        "@Any.qst1.ans5": ["snFoundation", "snWicket", "snFacade", "@Parent.sn5"],
        "@Any.qst1.ans2": ["qst2", "snWicket", "snFacade", "@Parent.sn5"]
    },
    "questions": {
        "qst1": {
            "type": "radio",
            "view": "textGrid",
            "question": "Чи да?",
            "answers": {
                "ans1": "да",
                "ans2": "нет",
                "ans3": "пизда"
            }
        },
        "qst2": {
            "type": "radio",
            "view": "cardsGrid",
            "question": "Какие ворота Вас интересуют?",
            "answers": {
                "ans1": { "text": "Откатные", "image": "" },
                "ans2": { "text": "Распашные", "image": "" },
                "ans3": { "text": "Секционно-подъёмные", "image": "" },
                "ans4": { "text": "Рулонные", "image": "" },
                "ans5": { "text": "Рольставни", "image": "" },
                "ans6": { "text": "Другое", "image": "" }
            }
        },
        "qst3": {
            "type": "radio",
            "view": "textGrid",
            "question": "Куда нужны ворота?",
            "answers": {
                "ans1": "Частный дом",
                "ans2": "Дача",
                "ans3": "Многоквартирный дом",
                "ans4": "Промышленный объект"
            }
        }
    }
}

for (let virtualComponentData of data.questions) {
    let quizQuestionModel = QuizQuestionModel.deserialize(virtualComponentData);
}