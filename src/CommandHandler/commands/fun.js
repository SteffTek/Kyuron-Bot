//IMPORTANT IMPORTS
const configHandler = require('../../Utils/configHandler.js');
const config = configHandler.getConfig();

const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');

const axios = require("axios");

// Exporting the command for the commandHandler
module.exports = {
	name: 'fun',
	description: 'Sets selected role for specified usage.',
	options: [
        {
            "name":"mock",
            "description":"Text Mocking.",
            "type":1,
            "options":[
                {
                    "name":"text",
                    "description":"Text to mock.",
                    "required":true,
                    "type":3,
                }
            ]
        },{
            "name":"meme",
            "description":"Gets Meme from haha funny site [Reddit].",
            "type":1,
            "options":[
                {
                    "name":"subreddit",
                    "description":"Optional subreddit.",
                    "required":false,
                    "type":3,
                }
            ]
        },{
            "name":"cookie",
            "description":"Give someone a cookie!",
            "type":1,
            "options":[
                {
                    "name":"user",
                    "description":"User to give cookie.",
                    "required":true,
                    "type":6,
                }
            ]
        },{
            "name":"color",
            "description":"Gives back a random color.",
            "type":1
        },{
            "name":"ship",
            "description":"Ship two users :3",
            "type":1,
            "options":[
                {
                    "name":"user1",
                    "description":"First user.",
                    "required":true,
                    "type":6,
                },{
                    "name":"user2",
                    "description":"Second user.",
                    "required":false,
                    "type":6,
                }
            ]
        }
    ],
	async execute(data) {
        //GET TYPE
        const type = data.args[0].name;

        if(type === "mock") {
            const text = mocking(data.args[0].options[0]?.value);
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("💢MOCK!💢", config.colors.fun.MOCK,`**${text}**`)]}, data.interaction)
            return;
        }

        if(type === "meme") {
            var subReddit = "";
            if(data?.args[0]?.options) {
                subReddit = data?.args[0]?.options[0]?.value;
            }
            const meme = await getMeme(subReddit);

            if (meme === null){
                APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("Error while fetching for meme :/")]}, data.interaction)
                return;
            }
            if (meme.url.length === 0 || meme.nsfw || meme.spoiler){
                APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("Error while fetching for meme :/")]}, data.interaction)
                return;
            }

            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.image("😂MEME!🤣", config.colors.fun.MEME,`**${meme.title}**`,meme.url)]}, data.interaction)
            return;
        }

		//GET DATA
        const roleType = data.args[0].options[0]?.value;
        const roleID = data.args[0].options[1]?.value;



		//APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("FUN", "0xFF964F", "FUN")]}, data.interaction)
	}
};

/*
    TEXT MOCKING FUNCTIONS
*/
function mocking(string) {
    let str = "";

    for(let i = 0; i < string.length; i++) {
        let char = string.charAt(i);
        str += transform(char);
    }

    return str;
}

function transform(char) {
    if (char === "ß" || char === "ẞ") return char;
    return Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase();
}

/*
    MEME FUNCTIONS
*/
async function getMeme(reddit) {
    let url = "https://meme-api.herokuapp.com/gimme" + (reddit == "" ? "" : "/" + reddit);
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        logger.error(error + " [Sub Reddit: " + reddit + "]");
        return null;
    }
}