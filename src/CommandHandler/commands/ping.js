module.exports = {
	name: 'ping',
	description: 'Ping!',
	options: [],
	async execute(data) {
		data.channel.send("Pong!")
	}
};