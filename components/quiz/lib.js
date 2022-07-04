'use strict';

/**
 * CamelCase to kebab-case
 * @param {string} string 
 * @returns {string} kebab-case string 
 */
export function kebabize(string) {
    return string.replace(/\b([A-Z][a-z]*)+\b/g, n => n.replace(/([A-Z])/g, '-$1').replace(/^-/, '').toLowerCase());
}

/**
 * kebab-case to CamelCase
 * @param {string} str 
 * @returns {string} CamelCaseString
 */
export function camelize(string) {
    return string.replace(/-./g, x=>x[1].toUpperCase());
}

'<input oninput="this.value = phoneFormate(this.value)">';
function phoneFormate(value) {
    let prefix = ""
    if (value[0] === "+") prefix = "+";
    value = value.replace(/\D/g, '').split(/(?=.)/);
    value = value.filter((val) => {
      val = parseInt(val);
      return Number.isInteger(val)
    })
    let i = value.length;
    if (i >= 11) value.length = 11;
    console.log(value);
    if (i >= 1) {
      if (value[0] === "7" || value[0] === "8") value.splice(0, 1, 7);
      else {value.unshift("7"); ++i}
    }
    if (i >= 1) value.unshift('+ ');
    if (i >= 2) value.splice(2, 0, ' ');
    if (i >= 5) value.splice(6, 0, ' ');
    if (i >= 8) value.splice(10, 0, '-');
    if (i >= 10) value.splice(13, 0, '-');
    return value.join('') ?value.join('') : prefix;
  }