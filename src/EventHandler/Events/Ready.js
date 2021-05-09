//IMPORTANT IMPORTS
const logger = require("../../Utils/Logger");
const db = require('./../../Database/db.js');
const AnnouncementClass = require('../../Modules/Announcement');
const announcement = require("../../Database/models/announcement.js");

const configHandler = require("../../Utils/ConfigHandler");
const config = configHandler.getConfig();


module.exports = (client) => {
    logger.done(`Logged in as ${client.user.tag}!`);

    //GUILD STARTUP
    client.guilds.cache.each(guild => {
        db.loadGuildData(guild.id).then(guildData => {
            const channel = client.channels.resolve(guildData.channels.ticketSystemChannel);
            if(!channel) return;
            channel.messages.fetch(guildData.messageIDs.ticketSystem);
        });
    });

    //ANNOUNCEMENT STARTUP
    announcement.find({}).then(loadedAnnouncements => {
        for(let i = 0; i < loadedAnnouncements.length; i++) {

            let guildID = loadedAnnouncements[i].discordGuildID;
            let channelID = loadedAnnouncements[i].discordChannelID;
            let url = loadedAnnouncements[i].channelURL;
            let platform = loadedAnnouncements[i].channelType;
            let message = loadedAnnouncements[i].displayText;

            let announcementObj = new AnnouncementClass(client, url, platform, guildID, channelID, message);
            announcements[guildID + channelID + url] = announcementObj;
        }
    });

    //INTERACTION LISTENER
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        let commandName = interaction.data.name.toLowerCase();
        let channel = await client.channels.fetch(interaction.channel_id);
        let guildData = await db.loadGuildData(interaction.guild_id);

        const command = client.commands.get(commandName)
        try {
            command.execute({"client": client, "author": interaction.member, "channel": channel, "guildData": guildData, "args": interaction.data.options, "interaction": interaction});
        } catch (error) {
            console.error(error);
            channel.send("An error occured while trying to execute that command.");
        }
    });

    //PRESENCE
    var presences = config.presences;
    var index = 0;
    setInterval(() => {
        client.user.setPresence({
            status: 'online',
            activity: {
                name: "/help | " + presences[index],
                type: "PLAYING"
            }
        });

        index++;
        if(index >= presences.length) index = 0;
    }, 5 * 60 * 1000); //EVERY 5 MINUTES CHANGE PRESENCE
}