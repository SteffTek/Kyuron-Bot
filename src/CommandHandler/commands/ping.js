//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')

module.exports = {
	name: 'ping',
	description: 'Ping!',
	options: [],
	async execute(data) {
		APICalls.sendInteraction(data.client, {"content": "PONG!",}, data.interaction)
	}
};