'use strict';

/**
 * Осуществляет создание разметки из \<template\>
 * Конечный класс. Не может быть расширен! все манипуляции с экземпляром HTML шаблона через MirrorStorage
 */
export class TemplateProvider {
    // Это целесообразнее сделать TemplateSpawner'ом
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
     * @param {HTMLTemplateElement} template 
     */
    constructor(template) {
        this._template = template;
        this._beforeSpawnListeners = new Set();
        this._afterSpawnListeners = new Set();

        this.spawnTemplateIn = this.spawnTemplateIn.bind(this);
    }

    /**
     * @returns {DocumentFragment} rootElement
     */
    _createHTML() { return this._template.content.cloneNode(true); }

    /**
     * @param {Element} slot
     * @returns {Element} slot
     */
    spawnTemplateIn(slot, rewrite = true) {
        let component = this._createHTML();
        this._activateBeforeSpawn(component);
        if (rewrite) slot.innerHTML = '';
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