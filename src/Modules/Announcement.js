const { default: axios } = require("axios");
const configHandler = require('./../Utils/configHandler.js');
const AuditLog = require("./AuditLog.js");
const config = configHandler.getConfig();
const Twitch = require("twitch.tv-api");
const db = require("../Database/db");

/**
 * The Announcement class for guildData
 */
module.exports = class Announcement {
    /**
     * Creates a new Announcement class
     * @param {Object} client discord client
     * @param {String} channelURL channel url
     * @param {String} channelType channel type
     * @param {String} discordGuildID discord guild id
     * @param {String} discordChannelID discord channel id
     * @returns {Announcement} The Announcement class
     */
    constructor(client, channelURL, channelType, discordGuildID, discordChannelID, displayText){
        this.client = client;
        this.channelURL = channelURL;
        this.channelType = channelType,
        this.discordGuildID = discordGuildID;
        this.discordChannelID = discordChannelID;
        this.channelID = this.fetchChannelID(channelURL, channelType);

        this.newerThan = null;
        this.displayText = displayText;
        this.channelName = "";

        //CHECK VALIDITY
        if(this.channelID === null) {
            this.isValid = false;
            return;
        }
        this.isValid = true;

        //TWITCH SHIT
        // Twitch Login details
        if(this.channelType === "twitch")
            this.twitch = new Twitch({
                id: config.authentication.twitch,
                secret: config.authentication.twitchSecret
            });

        //GET DISCORD STUFF
        this.dcGuild = client.guilds.fetch(discordGuildID);

        this.dcChannel = null;
        client.channels.fetch(discordChannelID).then(channel => {
            this.dcChannel = channel;

            //CHECK NEWEST UPON START
            this.lastContent = "";
            this.fetchChannelContent();

            //STARTUP LOOP
            this.announcementHandler();
        }).catch(err => {
            //REMOVE IF CHANNEL NO LONGER VALID
            db.removeAnnouncement(this.discordGuildID, this.discordChannelID, this.channelURL);
        });
    }

    /**
     * Fetches the channel ID from a URL
     * @param {String} channelURL channel url
     * @param {String} channelType channel type
     * @returns {String} channel id
     */
    fetchChannelID(channelURL, channelType) {
        var pattern = "";
        var subgroup = 0;

        if(channelType == "youtube") { subgroup = 3; pattern = /^(?:(http|https):\/\/[a-zA-Z-]*\.{0,1}[a-zA-Z-]{3,}\.[a-z]{2,})\/channel\/([a-zA-Z0-9_]{3,})$/; }
        if(channelType == "twitch") { subgroup = 2; pattern = /^(?:https?:\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/; }
        if(channelType == "twitter") { subgroup = 4; pattern = /^https?:\/\/(www\.)?twitter\.com\/(#!\/)?([^\/]+)(\/\w+)*$/; }

        var matches = channelURL.match(pattern);
        if(matches == null || pattern == "") {
            return null;
        }

        return matches[subgroup - 1];
    }

    /**
     * Fetches latest channel content
    */
    fetchChannelContent() {
        switch(this.channelType) {
            case "youtube":
                axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${this.channelID}&maxResults=1&order=date&type=video&key=${config.authentication.youtube}` + (this.newerThan ? "&publishedAfter=" + this.newerThan : "")).then(json => {
                    if(json.data.items.length == 0) {
                        return;
                    }

                    let content = json.data.items[0].id.videoId;
                    if(this.lastContent !== content && this.lastContent !== "") {
                        this.lastContent = content;
                        this.channelName = json.data.items[0].snippet.channelTitle;
                        this.newerThan = json.data.items[0].snippet.publishTime;
                        this.announce();
                    }

                    //CHECK FIRST TIME
                    if(this.lastContent == "") {
                        this.lastContent = content
                        this.channelName = json.data.items[0].snippet.channelTitle;
                        this.newerThan = json.data.items[0].snippet.publishTime;
                    }
                }).catch(err => {
                   //Ignore, I guess?
                })
                break;

            case "twitter":
                axios.get(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${this.channelID}&count=1` + (this.newerThan ? "&since_id=" + this.newerThan : ""), {headers: {"Authorization":"Bearer " + config.authentication.twitter}}).then(json => {
                    if(json.data.length == 0) {
                        return;
                    }

                    let content = json.data[0].id_str;
                    if(this.lastContent !== content && this.lastContent !== "") {
                        this.lastContent = content;
                        this.newerThan = json.data[0].id;
                        this.channelName = json.data[0].user.screen_name;
                        this.announce();
                    }

                    //CHECK FIRST TIME
                    if(this.lastContent == "") {
                        this.lastContent = content
                        this.newerThan = json.data[0].id;
                        this.channelName = json.data[0].user.screen_name;
                    }
                }).catch(err => {
                    //Ignoring again!
                })

                break;

            case "twitch":
                this.twitch.getUser(this.channelID).then(data => {
                    if(!data.stream) {
                        this.lastContent = "";
                        return;
                    }

                    this.channelName = this.channelID;
                    if(data.stream.stream_type === "live") {
                        if(data.stream.stream_type !== this.lastContent) {
                            this.lastContent = data.stream.stream_type;
                            this.announce();
                        }
                    }
                }).catch(err => {
                    //Ignoring again!
                })
                break;

            default:
                this.lastContent = "";
                break;
        }
    }

    /**
     * Scans every X Minutes for new content
    */
    announcementHandler() {
        var announcement = this;
        this.interval = setInterval(async function() {
            announcement.fetchChannelContent();
        }, 5 * 60 * 1000) //EVERY 5 MINUTES CHECK FOR NEW
    }

    /**
     * Stops the Scan
    */
    clearHandler() {
        if(this.interval !== null) {
            clearInterval(this.interval);
        }
    }

    /**
     * Sends Announcement
    */
    announce() {
        var text = this.displayText;

        //REPLACE VARS
        if(this.channelType === "youtube")
            text = text.replace("%link%",`https://www.youtube.com/watch?v=${this.lastContent}`)

        if(this.channelType === "twitter")
            text = text.replace("%link%",`https://twitter.com/${this.channelName}/status/${this.lastContent}`)

        if(this.channelType === "twitch")
            text = text.replace("%link%",`https://twitch.tv/${this.channelName}`)

        text = text.replace("%user%", this.channelName);

        this.dcChannel.send(text);
    }
}