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
        this.actionSets = [ /* ACTION_SET */ ];
        this.enabledRules = {
            blacklist:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            invite:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            links:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            caps:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            emotes:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            mentions:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            spam:{
                enabled: false,
                action: "delete",
                whitelist: []
            }
        }
    }

    /**
     * Loads a AutoMod class from an already existing object
     *
     * @param {object} obj AutoMod object
     * @returns {AutoMod} AutoMod class
     */
    static load(obj){
        let am = new this()
        am.actionSets = obj.actionSets;
        am.enabledRules = obj.enabledRules;
        return am;
    }

    /**
     * Handles incoming warns by the defined action set
     *
     * @param {object} guildData guildData object
     * @param {object} member member object
     */
    handleWarn(guildData, member) {
        console.log(member);
    }

    /**
     * Handles incoming messages by the defined rules
     *
     * @param {object} guildData guildData object
     * @param {object} message message object
     */
    handleMessage(guildData, message) {
        console.log(message);

        var warned = false;

        //HANDLE USER AFTER INFRACTIONS
        if(warned) {
            this.handleWarn(guildData, message.member);
        }
    }
}

/*
    ACTION SET EXAMPLE
*/
const action_set = {
    "what": "ban/kick/mute/tempban/tempmute",
    "timespan": 30, //TIME MINUTES
    "warns": 4, //AMOUNT WARNS
    "duration": 30,
    "durationType": "minutes"
}