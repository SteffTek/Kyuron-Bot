//IMPORTANT IMPORTS
const db = require('./../../Database/db.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require("../../Utils/permissionChecker");

module.exports = async (client, message) => {
    // return if author is a bot or if the message was sent via DM
    if (message.author.bot || message.guild === null){
        return;
    }
    let guildData = await db.loadGuildData(message.guild.id);

    //BLACKLIST REMOVE MESSAGE
    if (new RegExp(guildData.blacklist.join("|")).test(message.content.toLowerCase())) {

        let member = message.member;
        if(permissionChecker.isModerator(guildData, member)) {
            return;
        }

        message.reply("you can't use that here!⚠️")
        message.delete();
        return;
    }

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