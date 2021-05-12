//IMPORTANT IMPORTS
const logger = require("./src/Utils/logger");
const configHandler = require("./src/Utils/configHandler");
const config = configHandler.getConfig();
const Discord = require('discord.js');
const APICalls = require('./src/Utils/APICalls.js')
const db = require('./src/Database/db')

//MANAGERS
const eventListener = require("./src/EventHandler/EventListener");
const commandHandler = require('./src/CommandHandler/commandHandler.js')

//GLOBAL VARS
global.announcements = {} //GLOBAL ACCESSIBLE LIST OF ANNOUNCEMENTS
global.autoVoiceChannels = [] //GLOBAL LIST OF VOICE CHANNEL IDs THAT ARE TEMPORARY

//VARS
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] }); //PARTIALS FOR REACTION ON OLD MESSAGES

// APP INFO
let version = configHandler.getVersion();
let appName = configHandler.getName();
let devName = configHandler.getAuthor();

let splashPadding = 12 + appName.length + version.toString().length;

/* PRINT CREDITS & VERSION */
console.log(
    "\n" +
    ` #${"-".repeat(splashPadding)}#\n` +
    ` # Started ${appName} v${version} #\n` +
    ` #${"-".repeat(splashPadding)}#\n\n` +
    ` Copyright (c) ${(new Date()).getFullYear()} ${devName}\n`
);

/* STARTUP */

//Load DB
db.connect();

//Registering Managers
eventListener(client);

//Load commands
commandHandler(client)

//Initializing Debug Guild-Commands
/*
let debugCMD = client.commands.get("unmute")
APICalls.createGuildCommand(config.discord.appID, config.discord.testGuildID, {name: debugCMD.name, description: debugCMD.description, options: debugCMD.options})
*/

//Log in Client
logger.info("Logging in...")
client.login(config.discord.token);