const Eris = require("eris")
const MessageEmbed = require("davie-eris-embed")

/**
 * 
 * @param {Eris.Client} client 
 * @param {Eris.Message} message 
 */
module.exports = async (client, message) => {
    // Define prefix
    const prefix = client.config.prefix

    // Sanity checks
    if (message.author.bot) return;
    if (message.channel.type == undefined) return;

    // Argument & command parsing
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    let command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command.disabled) return;

    // If command requires args and there are none, error
    if (command.args && !args.length) {
        return message.channel.sendEmbed((new MessageEmbed())
            .setColor("#aa6666")
            .setTitle("This command requires arguments.")
            .addField("Proper usage: ", `${prefix}${commandName} ${command.usage}`)
        )
    }

    // Try to execute command, error embed if it errors out
    try {
        await command.execute(client, message, args)
    } catch (error) {
        message.channel.sendEmbed((new MessageEmbed())
            .setColor("#aa6666")
            .setTitle("An error occurred running this command")
            .setDescription(error.toString())
        )
        console.error(error)
    }
}