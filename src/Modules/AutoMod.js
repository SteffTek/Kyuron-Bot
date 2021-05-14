/**
 * The AutoMod class for guildData
 */
module.exports = class AutoMod {
    /**
     * Creates a new AutoMod class
     *
     * @returns {AutoMod} The AutoMod class
     */
    constructor(){
        this.ruleSets = { /* ID:RULESET */};
    }

    /**
     * Loads a LevelSystem class from an already existing object
     *
     * @param {object} obj AutoMod object
     * @returns {AutoMod} AutoMod class
     */
    static load(obj){
        let am = new this()
        am.ruleSets = obj.ruleSets;
        return am;
    }


}

/*
    RULE SET EXAMPLE
*/
const default_rule_set = {
    "what":"warn/blacklisted word/link/mass emoji",
    "amount":3, /* After 3 warns, more than 3 emojis (Ignored for links and blacklisted words) */
    "where": ["ignored channels"],
    "what":"warn/mute/ban/tempmute/tempban/kick"
}