'use strict';

/**
 * Осуществляет создание разметки из \<template\>
 * Конечный класс. Не может быть расширен! все манипуляции с экземпляром HTML шаблона через MirrorStorage
 */
export class TemplateProvider {
    /**
     * @param {HTMLTemplateElement} template
     */
    constructor(template) {
        this._template = template;
    }

    /**
     * @returns {Element} component
     */
    createHTML() {
        if (this._template.content.childElementCount !== 1) {
            return document.createElement("div").innerHTML = this._template.content.cloneNode(true);
        }
        return this._template.content.firstElementChild.cloneNode(true);
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
        if (!(template instanceof HTMLTemplateElement)) {
            console.warn(`validateTemplate(template) был передан неверный аргумент: ${template}`);
            return false;
        }
        if (!('content' in template)) return false;
        return true;
    }

    /**
     * @param {string} templateName id of <template> element 
     * @returns {HTMLTemplateElement|null}
     */
    static findTemplateByName(templateName) { return TemplateProvider.validateTemplate(htmlTemplate) ? htmlTemplate : null; }
}