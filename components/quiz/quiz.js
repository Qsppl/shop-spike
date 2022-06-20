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
    validateTemplate(template) {
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
        _applyListenerCreators(element);
        _applyTemplateStateSource(element);
    }

    addEventListener()
}