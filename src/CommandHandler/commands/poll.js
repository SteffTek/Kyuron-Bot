//IMPORTANT IMPORTS
const configHandler = require('../../Utils/configHandler.js');
const config = configHandler.getConfig();

const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');
const logger = require('../../Utils/logger.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'poll',
	description: 'Lets you create simple polls.',
	options: [
        {
            "name":"vote",
            "description":"Simple up/down vote poll.",
            "type":1,
            "options":[
                {
                    "name":"text",
                    "description":"What's your poll about?",
                    "required":true,
                    "type":3,
                }
            ]
        },{
            "name":"survey",
            "description":"More complex poll with up to 10 answers!",
            "type":1,
            "options":[
                {
                    "name":"text",
                    "description":"What's your poll about?",
                    "required":true,
                    "type":3,
                },{
                    "name":"option1",
                    "description":"Option 1",
                    "required":true,
                    "type":3,
                },{
                    "name":"option2",
                    "description":"Option 2",
                    "required":true,
                    "type":3,
                },{
                    "name":"option3",
                    "description":"Option 3",
                    "required":false,
                    "type":3,
                },{
                    "name":"option4",
                    "description":"Option 4",
                    "required":false,
                    "type":3,
                },{
                    "name":"option5",
                    "description":"Option 5",
                    "required":false,
                    "type":3,
                },{
                    "name":"option6",
                    "description":"Option 6",
                    "required":false,
                    "type":3,
                },{
                    "name":"option7",
                    "description":"Option 7",
                    "required":false,
                    "type":3,
                },{
                    "name":"option8",
                    "description":"Option 8",
                    "required":false,
                    "type":3,
                },{
                    "name":"option9",
                    "description":"Option 9",
                    "required":false,
                    "type":3,
                },{
                    "name":"option10",
                    "description":"Option 10",
                    "required":false,
                    "type":3,
                }
            ]
        }
    ],
	async execute(data) {
        //CHECK MODULE
        if(!data.guildData.modules?.polls) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("This module isn't activated.")]}, data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isModerator(data.guildData, member)) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("**You don't have the permission to do this!**")]}, data.interaction)
            return;
        }

        //GET TYPE
        const type = data.args[0].name;

        // MOCK TEXT
        if(type === "vote") {
            const text = data.args[0].options[0]?.value;
            await APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("👍POLL!👎", config.colors.poll.VOTE,`**${text}**`)]}, data.interaction)

            //GET SENT MESSAGE
            let messageData = await APICalls.getInteractionMessage(data.interaction);
            data.channel.messages.fetch(messageData.id).then(async message => {
                //ADD REACTIONS
                message.react("👍").then(() => {
                    message.react("👎");
                })
            })

            return;
        }

        //MULTI
        var answers = [];
        for(let i = 0; i < data.args[0].options.length; i++) {
            answers.push(data.args[0].options[i].value);
        }
        let pollOptions = answers.slice(1);

        let optionsText = `**${answers[0]}**\n\n`;
        pollOptions.forEach((e, i) => (optionsText += `${NUMBERS[i]} - ${e}\n`));

        await APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("🔼SURVEY!🔽", config.colors.poll.SURVEY, optionsText)]}, data.interaction)

        //GET SENT MESSAGE
        let messageData = await APICalls.getInteractionMessage(data.interaction);
        data.channel.messages.fetch(messageData.id).then(async message => {
            for (let i in pollOptions) await message.react(EMOJI[i]);
        });
	}
};


//EMOTES
const NUMBERS = [
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
    ":seven:",
    ":eight:",
    ":nine:",
    ":keycap_ten:"
];

const EMOJI = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟"
];