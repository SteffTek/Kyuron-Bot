//IMPORTANT IMPORTS
const logger = require("../../Utils/Logger");
const db = require('./../../Database/db.js')

module.exports = (client) => {
    logger.done(`Logged in as ${client.user.tag}!`);

    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        let commandName = interaction.data.name.toLowerCase();
        let channel = await client.channels.fetch(interaction.channel_id)
        let guildData = await db.loadGuildData(interaction.guild_id)

        const command = client.commands.get(commandName)
        try {
            command.execute({"client": client, "author": interaction.member, "channel": channel, "guildData": guildData, "args": interaction.data.options, "interaction": interaction});
        } catch (error) {
            console.error(error);
            channel.send("An error occured while trying to execute that command.");
        }
    });
}