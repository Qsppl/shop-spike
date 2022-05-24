'use strict';

/**
 * @returns {Number} Viewport Width
 */
function getVW() {
    let docElem = document.documentElement;
    let body = document.querySelector('body');
    return window.innerWidth || docElem.clientWidth || body.clientWidth;
}

/**
 * @returns {Number} Viewport Height
 */
function getVH() {
    let docElem = document.documentElement;
    let body = document.querySelector('body');
    return window.innerHeight || docElem.clientHeight || body.clientHeight;
}

function getSetOfParents(element) {
    let set = new Set();
    while (element.parentNode) {
        element = element.parentNode;
        set.add(element);
    }
    return set;
}