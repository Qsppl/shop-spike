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