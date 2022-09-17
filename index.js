require("dotenv").config({ path: "./vars.env" });
const { TOKEN, GUILD_ID, CLIENT_ID } = process.env;

const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");
const Rostik = new Client({ intents: [GatewayIntentBits.Guilds] });
const guild = Rostik.guilds.cache.get(process.env.GUILD_ID);

const commands_list = [
    new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"),
    new SlashCommandBuilder().setName("ban").setDescription("Bans user").addUserOption(option =>
        option.setName('eblan')
            .setDescription('The input to echo back')
            .setRequired(true)),
    new SlashCommandBuilder().setName("unban").setDescription("Unbans user").addUserOption(option =>
        option.setName('eblan')
            .setDescription('The input to echo back')
            .setRequired(true)),
    new SlashCommandBuilder().setName("mute").setDescription("Mute user").addUserOption(option =>
        option.setName('eblan')
            .setDescription('user')
            .setRequired(true)).addIntegerOption(option =>
                option.setName('pizda')
                    .setDescription('time')
                    .setRequired(true)).addStringOption(option =>
                        option.setName('vagina')
                            .setDescription('reason')
                            .setRequired(true)),
]

const rest = new REST({ version: '10' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands_list })

Rostik.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');

    } else if (commandName === 'ban') {
        const user = interaction.options.getUser('eblan');
        const member = await interaction.guild.members.fetch(user.id);
        const banList = await interaction.guild.bans.fetch();
        const targetId = await banList.get(member);

        if (targetId) {
            return interaction.reply('балдаеб ужэ забанен');
        }

        try {
            await interaction.guild.members.ban(user);
            await interaction.reply(`${user} has been banned`);
        } catch (error) {
            interaction.reply('праизашла неизвесная ашыпка')
        }

        // try {
        //   if (targetId) {
        //     interaction.reply('балдаеб ужэ забанен');
        //   } else {
        //     await interaction.guild.members.ban(user);
        //     await interaction.reply(`${user} has been banned`);
        //   }
        // } catch(error) {
        //   interaction.reply('праизашла неизвесная ашыпка')
        // }

    } else if (commandName === 'unban') {
        const user = interaction.options.getUser('eblan');
        const member = await interaction.guild.members.fetch(user.id);
        const banList = await interaction.guild.bans.fetch();
        const targetId = await banList.get(member);

        if (!targetId) {
            await interaction.reply('балдаеб НЭ забанен');
        }

        try {
            await interaction.guild.members.unban(user);
            await interaction.reply(`${user} has been unbanned`);
        } catch (error) {
            interaction.reply('праизашла неизвесная ашыпка')
        }

    } else if (commandName === 'mute') {
        const user = interaction.options.getUser('eblan');
        const member = await interaction.guild.members.fetch(user.id)
        const time = interaction.options.getInteger('pizda');
        const reason = interaction.options.getString('vagina');

        if (member.isCommunicationDisabled()) {
            return interaction.reply(`пидар уже замучен`);
        }

        try {
            await member.timeout(time * 60 * 1000, reason);
            interaction.reply(`${user} has been muted`);
        } catch (error) {
            interaction.reply(`праизашла неизвесная ашыпка`);
        }
    }
});

Rostik.once("ready", function () {
    console.log(`✅ Logged in as ${Rostik.user.tag}`);
});

Rostik.login(TOKEN);