const MessageEmbed = require("davie-eris-embed")

module.exports = {
    name: "help",
    description: "Get a list of commands, or help with a specific command.",
    usage: "[command]",
    args: false,
    cooldown: 3,
    async execute(client, message, args) {
        // Filter out command.hidden commands
        const cmdmap = client.commands.filter(x => !x.hidden).map(x => x.name)
        const prefix = client.config.prefix
        let revision = ""
        try {
            revision = require('child_process')
                .execSync('git rev-parse --short HEAD')
                .toString().trim()
        } catch (e) {
            revision = "Git failed"
        }
        let helpEmbed = new MessageEmbed()
        
        // No-args main help list
        if (!args.length) {
            return message.channel.sendEmbed(helpEmbed
                .setColor("#6666aa")
                .setTitle(cmdmap.length + " commands")
                .setDescription(cmdmap.join(", "))
                .setFooter(`Want help using a specific command? Use ${prefix}help [command name]. • Version ${revision}`)
            )
        }

        const name = args[0].toLowerCase();
        const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name)); // get by name and/or alias

        if (!command) {
            return message.channel.sendEmbed(helpEmbed
                .setColor("#aa6666")
                .setTitle("Invalid command.")
            )
        }

        helpEmbed.setColor("#6666aa")

        let m = command.name.split('')
        m[0] = m[0].toUpperCase();
        m = m.join('')

        helpEmbed.setTitle(m);

        if (command.description) helpEmbed.setDescription(command.description)

        if (command.aliases) helpEmbed.addField("Aliases: ", command.aliases.join(", "))
        if (command.usage) helpEmbed.addField("Usage: ", `\`${prefix}${command.name} ${command.usage}\``)
        if (command.usage) helpEmbed.setFooter("Arguments in [] are optional. Arguments in <> are required.")

        message.channel.sendEmbed(helpEmbed)
    }
}