/**
 * The Announcement class for guildData
 */
module.exports = class Announcement {
    /**
     * Creates a new Announcement class
     * @param {String} channelURL channel url
     * @param {String} channelType channel type
     * @param {String} discordGuildID discord guild id
     * @param {String} discordChannelID discord channel id
     * @returns {Announcement} The Announcement class
     */
    constructor(channelURL, channelType, discordGuildID, discordChannelID){
        this.channelURL = channelURL;
        this.channelType = channelType,
        this.discordGuildID = discordGuildID;
        this.discordChannelID = discordChannelID;
        this.channelID = this.fetchChannelID(channelURL, channelType);

        //CHECK VALIDITY
        if(this.channelID === null) {
            this.isValid = false;
            return;
        }
        this.isValid = true;
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

    announcementHandler() {

    }
}