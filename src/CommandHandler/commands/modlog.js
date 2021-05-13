//IMPORTANT IMPORTS
const configHandler = require('../../Utils/configHandler.js');
const config = configHandler.getConfig();

const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');
const modAction = require('../../Database/models/modAction.js');
const logger = require('../../Utils/logger.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'modlog',
	description: 'Lets you create simple polls.',
	options: [
        {
            "name":"user",
            "description":"User",
            "type":6,
            "required":true
        },{
            "name":"page",
            "description":"Page of the mod log.",
            "type":4,
            "required":false
        }
    ],
	async execute(data) {
        //CHECK MODULE
        if(!data.guildData.modules?.moderation) {
            embedGen.error("**This module isn't activated.**",data.client,data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isModerator(data.guildData, member)) {
            embedGen.error("**You need the `MODERATOR` permission to do this!**",data.client,data.interaction)
            return;
        }


        //GET DATA
        let userID = data.args[0].value;
        let page = 0;
        if(data.args.length > 1) {
            page = data.args[1].value;

            page -= 1;
            if(page < 0) {
                page = 0;
            }
        }

        const size = 9;
        const offset = page * size;

        let client = data.client;
        let guild = client.guilds.resolve(data.channel.guild.id);
        let user = await client.users.fetch(userID);

        if(!user) {
            embedGen.error("**User couldn't be found!**",data.client,data.interaction)
            return;
        }

        //GETTING MOD LOG
        const docs = await modAction.find({
            guildID: guild.id,
            userID: user.id,
        }).sort({timestamp:-1}).limit(size).skip(offset).exec().catch(err => console.log(err));

        //GETTING MOD LOG COUNT
        const count = await modAction.countDocuments({
            guildID: guild.id,
            userID: user.id,
        });

        //CREATE EMBED
        var embed = embedGen.custom("MODLOG",config.colors.moderation.MODLOG,`**Showing ${docs.length} results of ${count} for user ${user}!**`);

        //POPULATE EMBED
        for(let i = 0; i < docs.length; i++) {
            let doc = docs[i];

            //GET DATA
            let moderator = await client.users.fetch(doc.moderatorID).catch(err => { /* */});
            if(!moderator) {
                moderator = client.user;
            }

            //POPULATE FIELD
            let title = (doc.isTemp ? "TEMP" : "") + doc.action.toUpperCase();
            let desc = `${new Date(doc.timestamp)}\n**By:** ${moderator}` + (doc.isTemp ? `\n**For:** ${((doc.until - doc.timestamp) / 1000 / 60).toFixed(2)} minutes.` : "") + (doc.reason === "" ? "" : "\n**Reason:** " + doc.reason);

            //ADD FIELD
            embed.addField(title,desc,true);
        }

        //SEND MODLOG
        APICalls.sendInteraction(data.client, {"content": "", "embeds": [embed]}, data.interaction)
	}
};