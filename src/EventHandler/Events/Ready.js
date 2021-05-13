//IMPORTANT IMPORTS
const logger = require("../../Utils/logger");
const db = require('./../../Database/db.js');

const AnnouncementClass = require('../../Modules/Announcement');
const announcement = require("../../Database/models/announcement");
const reactions = require("../../Database/models/reaction");
const auditLogger = require("../../Modules/AuditLog");

const configHandler = require("../../Utils/configHandler");
const tickets = require("../../Database/models/tickets");
const modAction = require("../../Database/models/modAction");
const config = configHandler.getConfig();

const setTimeout = require('safe-timers').setTimeout;

module.exports = (client) => {
    logger.done(`Logged in as ${client.user.tag}!`);

    //GUILD STARTUP
    //EDIT: CAN BE IGNORED. Due partials initialized on startup message reactions working for non cached messages. Keeping this code just in case!
    /*client.guilds.cache.each(guild => {
        db.loadGuildData(guild.id).then(guildData => {
            const channel = client.channels.resolve(guildData.channels.ticketSystemChannel);
            if(!channel) return;
            channel.messages.fetch(guildData.messageIDs.ticketSystem);
        });
    });*/

    //TICKET STARTUP
    tickets.find({}).then(loadedTickets => {
        for(let i = 0; i < loadedTickets.length; i++) {
            client.guilds.fetch(loadedTickets[i].guildID).then(guild => {
                const channel = guild.channels.resolve(loadedTickets[i].channelID);
                //IF CHANNEL GOT DELETED DURING LAST START => DELETE TICKET
                if(!channel) {
                    loadedTickets[i].remove();
                }
            }).catch(err => {/* IGNORE */})
        }
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

    //TEMP MUTE ACTION STARTUP
    modAction.find({isTemp: true, isDone: false, action: "mute"}).then(loadedModActions => {
        for(let i = 0; i < loadedModActions.length; i++) {
            client.guilds.fetch(loadedModActions[i].guildID).then(guild => {
                db.loadGuildData(loadedModActions[i].guildID).then(guildData => {
                    guild.roles.fetch(guildData.muteRole).then(role => {
                        guild.members.fetch(loadedModActions[i].userID).then(member => {
                            if(!member) {
                                return;
                            }

                            var until = loadedModActions[i].until;
                            if(until < Date.now()) {
                                //UNMUTE INSTANTLY
                                member.roles.remove(role);

                                //SAVE
                                loadedModActions[i].isDone = true;
                                loadedModActions[i].save().catch(err => {console.log(err)})

                                //ADD AUTOMATIC UNMUTE TO MODLOG
                                db.addModerationData(guild.id, member.id, "", "automatically unmuted", "unmute");

                                //SEND TO AUDIT LOGGER
                                auditLogger(client, guildData, "🗡️USER UNMUTED🗡️", `**User ${member} got automatically unmuted!**`);
                                return;
                            }

                            //TIMEOUT
                            setTimeout(function() {
                                //CHECK FOR UNMUTE
                                modAction.findOne({_id: loadedModActions[i]._id}).then(modActionData => {
                                    if(modActionData.isDone) {
                                        return;
                                    }

                                    //SAVE
                                    modActionData.isDone = true;
                                    modActionData.save().catch(err => {console.log(err)})

                                    //REMOVE ROLE
                                    member.roles.remove(role);

                                    //ADD AUTOMATIC UNMUTE TO MODLOG
                                    db.addModerationData(guild.id, member.id, "", "automatically unmuted", "unmute");

                                    //SEND TO AUDIT LOGGER
                                    auditLogger(client, guildData, "🗡️USER UNMUTED🗡️", `**User ${member} got automatically unmuted!**`);
                                }).catch(err => {console.log(err); /* ERROR LOL */ })
                            }, until - Date.now());

                        }).catch(err => {console.log(err); /* IGNORE */ })
                    }).catch(err => {console.log(err); /* IGNORE */ })
                })
            }).catch(err => {console.log(err);/* IGNORE */})
        }
    });

    //TEMP BAN ACTION STARTUP
    modAction.find({isTemp: true, isDone: false, action: "ban"}).then(loadedModActions => {
        for(let i = 0; i < loadedModActions.length; i++) {
            client.guilds.fetch(loadedModActions[i].guildID).then(guild => {
                db.loadGuildData(loadedModActions[i].guildID).then(guildData => {
                    client.users.fetch(loadedModActions[i].userID).then(user => {
                        if(!user) {
                            return;
                        }

                        var until = loadedModActions[i].until;
                        if(until < Date.now()) {
                            //SAVE
                            loadedModActions[i].isDone = true;
                            loadedModActions[i].save().catch(err => {console.log(err)})

                            //REMOVE ROLE
                            guild.members.unban(user.id).catch(err => { /* IGNORE LOL */ });

                            //ADD AUTOMATIC UNMUTE TO MODLOG
                            db.addModerationData(guild.id, user.id, "", "automatically unbanned", "unban");

                            //SEND TO AUDIT LOGGER
                            auditLogger(client, guildData, "✅USER UNBANNED✅", `**User ${user} got automatically unbanned!**`);
                            return;
                        }

                        //TIMEOUT
                        setTimeout(function() {
                            //CHECK FOR UNMUTE
                            modAction.findOne({_id: loadedModActions[i]._id}).then(modActionData => {
                                if(modActionData.isDone) {
                                    return;
                                }

                                //SAVE
                                loadedModActions[i].isDone = true;
                                loadedModActions[i].save().catch(err => {console.log(err)})

                                //REMOVE ROLE
                                guild.members.unban(user.id).catch(err => { /* IGNORE LOL */ });

                                //ADD AUTOMATIC UNMUTE TO MODLOG
                                db.addModerationData(guild.id, user.id, "", "automatically unbanned", "unban");

                                //SEND TO AUDIT LOGGER
                                auditLogger(client, guildData, "✅USER UNBANNED✅", `**User ${user} got automatically unbanned!**`);
                            }).catch(err => {console.log(err); /* ERROR LOL */ })
                        }, until - Date.now());

                    }).catch(err => {console.log(err); /* IGNORE */ })
                })
            }).catch(err => {console.log(err);/* IGNORE */})
        }
    });

    //INTERACTION LISTENER
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        //CHECK IF PRIVATE MESSAGE
        if(!interaction.guild_id) {
            channel.send("Commands cannot be used in private messages.");
            return;
        }

        //FETCH INFORMATION
        let commandName = interaction.data.name.toLowerCase();
        let channel = await client.channels.fetch(interaction.channel_id);
        let guildData = await db.loadGuildData(interaction.guild_id);

        //FETCH COMMAND
        const command = client.commands.get(commandName)

        //EXECUTE COMMAND
        try {
            command.execute({"client": client, "author": interaction.member, "channel": channel, "guildData": guildData, "args": interaction.data.options, "interaction": interaction});
        } catch (error) {
            console.error(error);
            channel.send("An error occured while trying to execute that command.");
        }
    });

    //PRESENCE
    var presences = config.presences;
    function setPresence(message) {
        client.user.setPresence({
            status: 'online',
            activity: {
                name: "/help | " + message,
                type: "PLAYING"
            }
        });

    }

    //STARTUP MESSAGE
    setPresence(presences[0]);

    //AUTO MESSAGE
    var index = 0;
    setInterval(() => {
        setPresence(presences[index]);
        index++;
        if(index >= presences.length) index = 0;
    }, 5 * 60 * 1000); //EVERY 5 MINUTES CHANGE PRESENCE
}