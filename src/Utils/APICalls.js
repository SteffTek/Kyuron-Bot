"use strict";
// IMPORTANT IMPORTS
const configHandler = require("../Utils/ConfigHandler");
const config = configHandler.getConfig();

// Core Modules
const axios = require('axios')

module.exports.createGuildCommand = async function (application_id, guild_id, data) {
    let http_config = {
        headers: {
            "Authorization": "Bot " + config.discord.token
        }
    }

    axios.post(`https://discordapp.com/api/v8/applications/${application_id}/guilds/${guild_id}/commands`, data, http_config)
        .catch(function (error) {
            console.log(error);
        });
}

module.exports.sendInteraction = async function (client, data, interaction, type) {
    if (!type) {
        type = 4
    }

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: type,
            data: data
        }
    })
}