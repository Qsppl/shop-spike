'use strict';

/**
 * CamelCase to kebab-case
 * @param {string} string 
 * @returns {string} kebab-case string 
 */
export function kebabize(string) {
    console.log('kebabize() ' + string);
    return string.replace(/\b([A-Z][a-z]*)+\b/g, n => n.replace(/([A-Z])/g, '-$1').replace(/^-/, '').toLowerCase());
}

/**
 * kebab-case to CamelCase
 * @param {string} str 
 * @returns {string} CamelCaseString
 */
export function camelize(string) {
    console.log('camelize() ' + string);
    return string.replace(/-./g, x=>x[1].toUpperCase());
}