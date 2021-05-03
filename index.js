//IMPORTS
const logger = require("./src/Utils/Logger");
const configHandler = require("./src/Utils/ConfigHandler");
const config = configHandler.getConfig();

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

//Für clara <3
logger.done("DONE");
logger.error("ERROR");
logger.info("INFO");
logger.warn("WARN");

logger.done(config.discord.token);