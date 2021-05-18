/**
 * The AutoResponder class for guildData
 */
module.exports = class AutoResponder {
    /**
     * Creates a new AutoResponder class
     *
     * @returns {AutoResponder} The AutoResponder class
     */
    constructor() {
        this.responses = [ /* RESPONSES */];
    }

    /**
     * Loads a AutoResponder class from an already existing object
     *
     * @param {object} obj AutoResponder object
     * @returns {AutoResponder} AutoResponder class
     */
    static load(obj) {
        let am = new this();

        //CHECK IF OBJ IS DEFINED
        if (!obj) {
            return am;
        }

        am.responses = obj.responses;
        return am;
    }

    /**
     * Handles incoming messages by the defined responses
     *
     * @param {object} message message object
     */
    handleMessage(message) {
        //CHECK IF BOT
        if (message.author.bot) {
            return;
        }

        //STRIP MESSAGE
        var content = message.content.toLowerCase().replace("?", "").replace(".", "").replace(",", "").replace("!", "").replace("'", "").replace("`", "").replace('"', "").trim();

        //GET RESPONSE
        var response = this.getResponse(content, message.channel.id);

        //CHECK RESPONSE
        if (!response) {
            return;
        }

        //RESPOND
        message.reply(response.response);
    }

    /**
     * Checks if a given channel has a response by name
     *
     * @param {string} name response name
     * @param {string} channelID channelID
     * @returns {boolean} has response
     */
    hasResponse(name, channelID) {
        for (let response in this.responses) {
            response = this.responses[response];

            if (response.name === name && response.channelID === channelID) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets if a given channel response by question
     *
     * @param {string} question question
     * @param {string} channelID channelID
     * @returns {object} has response
     */
    getResponse(question, channelID) {
        for (let response in this.responses) {
            response = this.responses[response];

            if (response.question === question && response.channelID === channelID) {
                return response;
            }
        }
        return null;
    }

    /**
     * Removes response by name
     *
     * @param {string} name name
     * @param {string} channelID channelID
     */
    removeResponse(name, channelID) {
        for (let response in this.responses) {
            var responseObj = this.responses[response];
            if (responseObj.name === name && responseObj.channelID === channelID) {
                this.responses.splice(response,1);
            }
        }
    }
}


/*
    SAMPLE RESPONSE
*/
const example = {
    name: "UNIQUE NAME",
    channelID: "CHNID",
    question: "how to sub",
    response: "GO TO MY CHENNEL!"
}