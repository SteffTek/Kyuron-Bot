const configHandler = require("./configHandler");
const config = configHandler.getConfig();

/**
 * Creates a new ID
 * @param {number} length length of the id needed
 * @returns {string} id generated
 */
function makeID(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

/**
 * Creates a new ID
 * @param {string} module module name
 * @param {string} colorKey color key
 * @returns {string} color
 */
function getColor(module, colorKey) {
    var color = config.colors[module]?.[colorKey];
    if(!color) {
        color = "0xFF964F";
    }

    return color;
}

module.exports = {
    getColor: getColor,
    makeID: makeID
}