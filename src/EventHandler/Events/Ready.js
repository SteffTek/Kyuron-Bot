const logger = require("../../Utils/Logger");

module.exports = (client) => {
    logger.done(`Logged in as ${client.user.tag}!`);

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
}