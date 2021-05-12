//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');
const auditLogger = require("../../Modules/AuditLog");

const db = require("../../Database/db");
const modAction = require("../../Database/models/modAction");

const configHandler = require("../../Utils/configHandler");
const config = configHandler.getConfig();

// Exporting the command for the commandHandler
module.exports = {
	name: 'unban',
	description: 'Removes a ban from a user.',
	options: [
        {
            "name":"user",
            "description":"User ID",
            "type":	3,
            "required": true,
        }
    ],
	async execute(data) {
        //CHECK MODULE
        if(!data.guildData.modules?.moderation) {
            embedGen.error("**This module isn't activated.**",data.client,data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.fetch(data.author.user.id);
        if(!permissionChecker.isModerator(data.guildData, member)) {
            embedGen.error("**You need the `MODERATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

        //GET DATA
        let userID = data.args[0].value;
        let reason = null;
        if(data.args.length > 1) {
            reason = data.args[1].value;
        }

        let client = data.client;
        let guild = client.guilds.resolve(data.channel.guild.id);
        let userObj = await client.users.fetch(userID).catch(err => { /* User not Found! */ })

        if(!userObj) {
            embedGen.error("**User couldn't be found!**",data.client,data.interaction)
            return;
        }

        //UNBAN USER
        guild.members.unban(userObj.id).then(async () => {
            let desc = `**User ${userObj} got unbanned by ${member}!**`
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("✅USER UNBANNED✅", config.colors.moderation.UNBAN, desc)]}, data.interaction)

            //SEND TO AUDIT LOGGER
            auditLogger(client, data.guildData, "✅USER UNBANNED✅", desc);

            //SENT TO MOD LOG
            db.addModerationData(guild.id, userObj.id, member.id, "", "unban");

            //CHECK FOR RECENT TEMP MUTE THATS NOT CLEARED
            let doc = await modAction.findOne({
                guildID: guild.id,
                userID: userMember.id,
                action: "ban",
                isTemp: true,
                isDone: false
            }).sort({x:-1}).exec().catch(err => console.log(err));
            if(doc === null) { return; }
            doc.isDone = true;
            doc.save().catch(err => console.log(err));

        }).catch(err => {
            /* User wasn't banned, lol! */
            embedGen.error("**User isn't banned!**",data.client,data.interaction);
            return;
        })
    }
};