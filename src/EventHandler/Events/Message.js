//IMPORTANT IMPORTS
const db = require('./../../Database/db.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require("../../Utils/permissionChecker");
const AutoMod = require('../../Modules/AutoMod.js');

/*
    LAST MESSAGE STORE
    Stores last messages from users in guilds by id.
    Needed for check auto mod spam.
*/
const lastUserMessages = {
    /* GUILDID {
        USERID:MESSAGE
    } */
}

module.exports = async (client, message) => {
    // return if author is a bot or if the message was sent via DM
    if (message.author.bot || message.guild === null){
        return;
    }
    let guildData = await db.loadGuildData(message.guild.id);

    //GET LAST MESSAGE AND INIT IF NO GUILD STORE
    if(!lastUserMessages[message.guild.id]) {
        lastUserMessages[message.guild.id] = {} //INIT MESSAGE STORE
    }
    let lastMessage = lastUserMessages[message.guild.id][message.author.id]; //GET LAST

    //SEND TO AUTO MOD
    if(guildData?.modules?.autoMod) {
        if(!permissionChecker.isModerator(guildData, message.member)) {
            let autoMod = AutoMod.load(guildData.autoMod);
            autoMod.handleMessage(client, guildData, message, lastMessage);
        }
    }

    //SET LAST USER MESSAGE IF AUTO MOD SPAM ACTIVE
    if(guildData?.modules?.autoMod) {
        if(guildData?.autoMod?.enabledRules?.spam?.enabled)
            lastUserMessages[message.guild.id][message.author.id] = message;
    }

    //SEND TO AUTO RESPONDER
    guildData.autoResponder.handleMessage(message);

    // LEVELSYSTEM
    if (guildData.modules.leveling){
        let lvlInfo = guildData.levelSystem.gainXP(message.author.id)

        // Saves the levelSystem when changes were made
        if (lvlInfo.save){
            guildData.markModified("levelSystem")
            guildData.save().catch(err => console.log(err));
        }

        // Sends a LevelUP message if all requirements are met
        if (guildData.levelSystem.sendLevelUpMessage && lvlInfo.lvlup.trigger){
            let ch = await client.channels.fetch(guildData.channels.levelSystemChannel)
            if (!ch){
                return;
            }

            let embed = embedGen.custom("🔼 LEVELUP 🔼", "0x7E97CC", guildData.messages.levelSystem.replace("%user%", message.member.displayName).replace("%level%", lvlInfo.lvlup.level))
            ch.send(embed)
        }

        // If role rewards are pending
        if (lvlInfo.reward.trigger){
            let role = message.member.guild.roles.cache.find(role => role.id === lvlInfo.reward.role);
            if (!role){
                return;
            }
            message.member.roles.add(role)
        }
    }
}