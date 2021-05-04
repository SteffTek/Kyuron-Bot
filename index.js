//IMPORTANT IMPORTS
const logger = require("./src/Utils/Logger");
const configHandler = require("./src/Utils/ConfigHandler");
const config = configHandler.getConfig();
const Discord = require('discord.js');
const APICalls = require('./src/Utils/APICalls.js')

//MANAGERS
const eventListener = require("./src/EventHandler/EventListener");
const commandHandler = require('./src/CommandHandler/commandHandler.js')

//VARS
const client = new Discord.Client();

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

//Registering Managers
eventListener(client);

//Load commands
commandHandler(client)

//Initializing Debug Guild-Commands

/*
let debugCMD = client.commands.get("module")
APICalls.createGuildCommand(config.discord.appID, config.discord.testGuildID, {name: debugCMD.name, description: debugCMD.description, options: debugCMD.options})
*/

//Log in Client
logger.info("Logging in...")
client.login(config.discord.token);