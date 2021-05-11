//IMPORTANT IMPORTS
const configHandler = require('../../Utils/configHandler.js');
const config = configHandler.getConfig();

const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');
const logger = require('../../Utils/logger.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'giveaway',
	description: 'Lets you create simple polls.',
	options: [
        {
            "name":"price",
            "description":"The price to win!",
            "type":3,
            "required":true
        },{
            "name":"timer",
            "description":"Time for the giveaway in Minutes.",
            "type":4,
            "required":true
        }
    ],
	async execute(data) {
        //CHECK MODULE
        if(!data.guildData.modules?.giveaway) {
            embedGen.error("**This module isn't activated.**",data.client,data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isModerator(data.guildData, member)) {
            embedGen.error("**You need the `MODERATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

        //MULTI
        var price = data.args[0].value;
        var timer = data.args[1].value;
        if(timer <= 0) {
            timer = 1;
        }
        if(timer > 1440) {
            timer = 1440;
        }

        var endDate = new Date();
        endDate.setMinutes(endDate.getMinutes() + timer)

        var description = "**__A new giveaway has started!__**";

        //ADD USER
        description += `\n\nThe user ${member} started a new giveaway!\nEnter now to get a chance of winning: **${price}**!`;

        //ADD TIMER
        description += `\n\n_This giveaway lasts for ${timer} minutes since started!_\n**End is at ${endDate}!**`

        await APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("🎉GIVEAWAY!🎊", config.colors.giveaway.BODY, description)]}, data.interaction)

        //GET SENT MESSAGE
        let messageData = await APICalls.getInteractionMessage(data.interaction);
        data.channel.messages.fetch(messageData.id).then(async message => {
            //FILTER
            const filter = (reaction, user) => {
                return ["🎉"].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            message.awaitReactions(filter, {time: timer * 60 * 1000}).then(async collected => {
                var cache = collected.first().users.cache;
                cache.delete(data.client.user.id);
                let winner = getRandomUser(cache);
                //ANNOUNCE WINNER
                if(winner !== null)
                    message.channel.send(embedGen.custom("🎉GIVEAWAY ENDED!🎉",config.colors.giveaway.BODY,`**Go To [Giveaway](https://discord.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id})!** \n\nPrice: **${price}**\nTHE WINNER IS **${winner}**`))
            });

            //ADD REACTIONS
            message.react("🎉");
        });
	}
};

function getRandomUser(users) {
    if(users.array().length === 0) {
        return "Nobody entered! :("
    }

    var winner = users.random();
    return winner.tag;
}