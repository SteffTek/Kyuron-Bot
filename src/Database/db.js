//IMPORTANT IMPORTS
const mongoose = require('mongoose');
const configHandler = require('./../Utils/configHandler.js');
const guild = require('./models/guild.js');
const config = configHandler.getConfig();

//MONGOOSE MODELS
const Guild = require('./models/guild.js');

/*
 * Connects the client with MongoDB
 */
module.exports.connect = function () {
    mongoose.connect(config.database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err) {
        if (err) throw err;
        console.log("Connected to database")
    });
}

/**
 * Loads and Inits the guildData for the specified guildID
 *
 * @param {string} guildID guild id
 * 
 * @returns {object} guild data
 * 
 */
module.exports.loadGuildData = async function (guildID) {
    let doc = await Guild.findOne({
        guildID: guildID
    }).exec()

    if (doc === null) {
        const newDoc = await new Guild({
            guildID: guildID
        });

        await newDoc.save().catch(err => console.log(err)).then(() => { doc = newDoc})
    }

    return doc;
}