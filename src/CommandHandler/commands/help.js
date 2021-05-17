//IMPORTANT IMPORTS
const utils = require('../../Utils/utils.js');
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')

// Exporting the command for the commandHandler
module.exports = {
	name: 'help',
	description: 'Stop it. Get some help!',
	options: [],
	async execute(data) {
        //GET DM CHANNEL
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        let user = member.user;
        if(!user.dmChannel) {
            await user.createDM().catch(err => { return; /* YIKES BRO */ });
        }
        let dmChannel = user.dmChannel;

        //SEND DM
        dmChannel.send(embedGen.custom("Hey ho👋",utils.getColor("embedGen","default"),"You have requested some help! We put everything into a nifty help document on our webpage!\n\n **[Our online help page!](https://www.youtube.com/watch?v=dQw4w9WgXcQ)**")).then(message => {
            //SENDING ANSWER
            embedGen.custom("PSCHHH🤫", utils.getColor("embedGen","default"), "**_Look in your inbox!_**", data.client, data.interaction);
        }).catch(err => {
            //SENDING ERROR
            embedGen.error("I couldn't send you a private message :/ Make sure to enable it in settings!", data.client, data.interaction);
        });
	}
};