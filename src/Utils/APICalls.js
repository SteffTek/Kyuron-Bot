"use strict";
// IMPORTANT IMPORTS
const configHandler = require("../Utils/configHandler");
const config = configHandler.getConfig();

const http_config = {
    headers: {
        "Authorization": "Bot " + config.discord.token
    }
}

// Core Modules
const axios = require('axios')

module.exports.createGuildCommand = async function (application_id, guild_id, data) {
    axios.post(`https://discordapp.com/api/v8/applications/${application_id}/guilds/${guild_id}/commands`, data, http_config)
    .catch(function (error) {
        console.log(error);
    });
}

module.exports.createAppCommand = async function (application_id, data) {
    axios.post(`https://discordapp.com/api/v8/applications/${application_id}/commands`, data, http_config)
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

module.exports.sendFollowUp = async function (data, interaction) {
    axios.post(`https://discordapp.com/api/v8/webhooks/${config.discord.appID}/${interaction.token}`, data, http_config)
    .catch(function (error) {
        console.log(error);
    });
}

module.exports.getInteractionMessage = async function (interaction) {
    const result = await axios.get(`https://discordapp.com/api/v8/webhooks/${config.discord.appID}/${interaction.token}/messages/@original`, {}, http_config)
    .catch(function (error) {
        console.log(error);
        return null;
    }).then(result => {
        return result.data;
    })
    return result;
}