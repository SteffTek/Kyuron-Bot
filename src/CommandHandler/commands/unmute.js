//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');
const auditLogger = require("../../Modules/AuditLog");

const db = require("../../Database/db");
const modAction = require('../../Database/models/modAction.js');
const configHandler = require("../../Utils/configHandler");
const config = configHandler.getConfig();
const utils = require('../../Utils/utils.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'unmute',
	description: 'Removes a mute from a user.',
	options: [
        {
            "name":"user",
            "description":"User",
            "type":	6,
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
        let userMember = await guild.members.fetch(userID).catch(err => { /* */});

        if(!userMember) {
            embedGen.error(`**User couldn't be found!**`, data.client, data.interaction);
            return;
        }

        //GET MUTE ROLE
        var roleID = data.guildData.muteRole;
        var role = null;
        if(roleID.length > 0) {
            //FETCH ROLE
            role = await guild.roles.fetch(roleID).catch(err => { /* ROLE NOT FOUND */ });
        }

        //IF NO ROLE FOUND, HE CANT BE MUTED, CAN HE?
        if(!role) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error(`**No mute role exists!**`)]}, data.interaction)
            return;
        }

        //CHECK IF USER IS MUTED
        if(!userMember.roles.cache.find(r => r.id === role.id)) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error(`**User isn't muted!**`)]}, data.interaction)
            return;
        }

        //SET MUTED ROLE
        userMember.roles.remove(role);

        let desc = `**User ${userMember} got unmuted by ${member}!**`;
        APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("✅USER UNMUTED✅", utils.getColor("moderation","MUTE"), desc)]}, data.interaction)

        //SEND TO AUDIT LOGGER
        auditLogger(client, data.guildData, "✅USER UNMUTED✅", desc);

        //SENT TO MOD LOG
        db.addModerationData(guild.id, userMember.id, member.id, "", "unmute");

        //CHECK FOR RECENT TEMP MUTE THATS NOT CLEARED
        let doc = await modAction.findOne({
            guildID: guild.id,
            userID: userMember.id,
            action: "mute",
            isTemp: true,
            isDone: false
        }).sort({x:-1}).exec().catch(err => console.log(err));
        if(doc === null) { return; }

        doc.isDone = true;
        doc.save().catch(err => console.log(err));
    }
};