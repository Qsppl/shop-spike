/**
 * CamelCase to kebab-case
 * @param {string} string 
 * @returns {string} kebab-case string 
 */
function kebabize(string) { return string.replace(/[A-Z]/g, "-$&").toLowerCase(); }

/**
 * kebab-case to CamelCase
 * @param {string} str 
 * @returns {string} CamelCaseString
 */
function camelize(string) { return string.replace(/-./g, x=>x[1].toUpperCase()); }