//IMPORTANT IMPORTS
const logger = require("../Utils/Logger");
const configHandler = require("../Utils/ConfigHandler");
const config = configHandler.getConfig();
const Discord = require('discord.js');

/* EVENT IMPORTS */
const ready = require("./Events/Ready");
const message = require("./Events/Message");

module.exports = (client) => {

    /* Startup Event */
    client.on('ready', () => {
        ready(client);

        client.ws.on('INTERACTION_CREATE', async interaction => {
            const commandName = interaction.data.name.toLowerCase();
            const args = interaction.data.options;
            const author = interaction.member.user
            const channel = await client.channels.fetch(interaction.channel_id)
    
            const command = client.commands.get(commandName)
            try {
                command.execute({"client": client, "author": author, "channel": channel, "args": args, "interaction": interaction});
            } catch (error) {
                console.error(error);
                channel.send("An error occured while trying to execute that command.");
            }
        });
    });

    /*
        Message Event
    */
    client.on('message', msg => {
        message(client, msg);
    });

    /*
        CHANNEL EVENTS
    */
    client.on("channelCreate", channel => {

    });

    client.on("channelDelete", channel => {

    });

    client.on("channelUpdate", (oldChannel, newChannel) => {

    });

    /*
        EMOJI EVENTS
    */
    client.on("emojiCreate", emoji => {

    });

    client.on("emojiDelete", emoji => {
        
    });

    client.on("emojiUpdate", (oldEmoji, newEmoji) => {

    });
}