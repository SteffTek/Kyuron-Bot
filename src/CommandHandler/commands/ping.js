//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')

// Exporting the command for the commandHandler
module.exports = {
	name: 'ping',
	description: 'Ping!',
	options: [],
	async execute(data) {
		// Responding to the interaction with the client's websocket ping
		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("📡 PONG 📡", "0xFF964F", "Bot Latency: **`"+data.client.ws.ping+"ms`**")]}, data.interaction)
		console.log(data.guildData)
	}
};