/**
 * Осуществляет создание разметки из \<template\>
 * 
 * Может быть расширен для вставки в разметку данных при спавне разметки.
 */
class TemplateProvider {
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
    /**
     * @param {HTMLTemplateElement} template 
     */
    constructor(template) {
        this._template = template;
        this._beforeSpawnListeners = new Set();
        this._afterSpawnListeners = new Set();
    }

    /**
     * @returns {DocumentFragment} rootElement
     */
    _createHTML() { return this._template.content.cloneNode(true); }

    /**
     * @param {Element} slot
     * @returns {Element} slot
     */
    spawnTemplateIn(slot) {
        let component = this._createHTML();
        this._activateBeforeSpawn(component);
        slot.appendChild(component);
        this._activateAfterSpawn(slot);
        return slot;
    }

    /**
     * Колбэк вызываемый перед спавном компонента.
     * @param {Function} callback F(rootElement: DocumentFragment)
     */
    addBeforeSpawnListener(callback) { this._beforeSpawnListeners.add(callback); }
    _activateBeforeSpawn(component) { for (let callback of this._beforeSpawnListeners) callback(component); }

    /**
     * Колбэк вызываемый после спавна компонента.
     * @param {Function} callback F(rootElement: HTMLElement)
     */
    addAfterSpawnListener(callback) { this._afterSpawnListeners.add(callback); }
    _activateAfterSpawn(slot) { for (let callback of this._afterSpawnListeners) callback(slot); }
}

/**
 * Играет роль единственного источника истины для активных элементов в компонента. 
 * Синхронизирует внутреннее содержимое элементов компонента со своими свойствами.
 */
class MirrorStorage {
    constructor() {
        this.render = this.render.bind(this);
        this.attach = this.attach.bind(this);
    }
    /**
     * @param {string} str - kebab-case-string
     * @returns {string} CamelCaseString
     */
    static camelize(str) {
        let arr = str.split('-');
        let capital = arr.map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase());
        let capitalString = capital.join("");
        return capitalString;
    }

    /**
     * @returns {MirrorStorage} Прокси для записи свойств в хранилище.
     */
    getSyncProxy() {
        // критическая неоптимизированность. Можно переделать в транзакции или окраничить частоту обновления таймером.
        if (this._syncProxy !== undefined) return this._syncProxy;
        this._syncProxy = new Proxy(this, {
            set: function (target, prop, value, receiver) {
                target[prop] = value;
                target.render();
                return true;
            }
        });
        return this._syncProxy;
    }

    /**
     * Рендер состояний в HTMLElement'ы компонента
     * @param {HTMLElement|DocumentFragment} rootNode - Root-элемент компонента.
     */
    render(rootNode = this._rootElement) {
        if (rootNode === undefined) return false;
        for (let element of rootNode.querySelectorAll("[data-mirror]")) {
            let prop = element.dataset.mirror;
            if (prop in this) this._insert(element, this[prop]);
            else if (this.camelize(prop) in this) this._insert(element, this.camelize(prop));
        }
        return true;
    }

    /**
     * @param {HTMLElement} element
     * @param {*} value
     */
    _insert(element, value) {
        element.innerHTML = value;
    }

    /**
     * Синхронизировать компонент с этим хранилищем
     * @param {HTMLElement} rootElement - Root-элемент компонента.
     */
    attach(rootElement) { this._rootElement = rootElement }
}

/**
 * Монолит который связывает TemplateProvider c MirrorStorage и реализует модель.
 */
class VirtualComponent {
    /**
     * @param {TemplateProvider} templateProvider 
     */
    constructor(templateProvider) {
        let mirrorStorage = new MirrorStorage();
        this._mirrorStorage = mirrorStorage.getSyncProxy();
        this._templateProvider = templateProvider;
        templateProvider.addBeforeSpawnListener(this._mirrorStorage.render);
        templateProvider.addAfterSpawnListener(this._mirrorStorage.attach);
    }

    /**
     * Возвращает десериализованый компонент
     * @param {Object} serializedVirtualComponent
     * @returns {VirtualComponent}
     */
    deserializeComponent(serializedVirtualComponent) { }

    /**
     * Реестр компонентов
     */
    static _VCRegister = [];

    /**
    * Зарегистрировать сопоставление имени и класса для десериализации компонентов
    * @param {Function} constructor конструктор
    * @param {string} alias псевдоним
    */
    static registerComponent(constructor, alias = undefined) {
        if (typeof constructor === 'function' && typeof alias === 'undefined') {
            // передан один аргумент - конструктор
            alias = constructor.name;
        }

        this._VCRegister[alias] = constructor;
    }

    /**
     * Возвращает экземпляр расширенного класса VirtualComponent на основе сериализованых мета-данных.
     * @param {Object} serializedVirtualComponent
     * @returns {VirtualComponent} Конструктор расширенного класса.
     */
    static locateSerializedComponent(serializedVirtualComponent) {
        let constructor = this._VCRegister[serializedVirtualComponent.component];
        if (!constructor) throw TypeError(`${serializedVirtualComponent.component} не был зарегестрирован в ${typeof this}`);
        return constructor;
    }
}

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

// class quizViewer extends VirtualComponent {
//     constructor(quizViewerTemplate) {
//         super(quizViewerTemplate);
//     }

//     // ComponentStates
//     indicatorCounter = new QuizIndicatorCounter(0, 0);
//     percentProgress = 0;
//     beginningCounter = 0;
//     endCounter = 0;
//     scenesCount = 0;
//     responsePicWebp = "";
//     responsePicPng = "";
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