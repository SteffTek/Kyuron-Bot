const logger = require("../../Utils/Logger");

module.exports = (client) => {
    logger.done(`Logged in as ${client.user.tag}!`);
}