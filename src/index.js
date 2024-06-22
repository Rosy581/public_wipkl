require("dotenv").config();
const admin = require("firebase-admin");
const cmd = require("./register-commands");
const serviceAccount = require("../ServiceAccountKey");
const Logger = require("./logger.js")
const { ifDef, pull, pullColl, sleep } = require("../script");
const discordJs = require("discord.js");
const {
	Client,
	IntentsBitField,
	ActivityType,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder
} = require("discord.js"); 
const log = new Logger("./log.txt")
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://wipkl-413-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
const send = async (push) => {
	let num = await pull(db, "Matches", "num");
	try {
		db.collection("Matches")
			.doc(`Match-${num.numb}`)
			.set(push)
			.then(() => {
				console.log("sent", push);
			})
			.catch((error) => {
				console.error(`erwhore: ${error}`);
			});
		num.numb++;
		db.collection("Matches")
			.doc("num")
			.update({
				numb: num.numb,
			})
			.then(() => {
				console.log(`sent ${num.numb - 1}`);
			});
	} catch (error) {
		console.error(`erwhore: ${error}`);
	}
	return {
		number: num.numb,
		info: push,
	};
};

const bot = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

const pinger = async (ch) => {
	const now = { date: Date.now() }
	let dates = [now]
	let max = await pull(db, "Matches", "num")
	max = max.numb
	console.log(max)
	for (let i = 0; i < max; i++) {
		a = await pull(db, "Matches", "Match-" + i)
		a.date = new Date(a.date)
		dates.push(a)
		console.log(a)
	}
	console.log(dates)
	dates.sort(
		(a, b) => {
			return new Date(a.date).getTime() - new Date(b.date).getTime()
		})
	console.log(dates)
	dates.splice(0, dates.indexOf(now) + 1)
	console.log(dates)
	for (let i = 0; i < dates.length; i++) {
		sleep(dates[i].date - Date.now())
		console.log("Time")
	}
	return dates[1]
};

bot.on("messageCreate", async (message) => {
	log.log(`${message.author.username} said ${message.content} `)
	if (message.author.bot === true) {
		log.log("Bot message")
		return;
	} else if (/\bpickle\b/i.test(message.content)) {
		message.reply("https://i.imgur.com/zTwV2Fg.gif");
		log.log(`Replied with pickle gif`)
	} else if (/\b:3\b/.test(message.content)) {
		message.reply("# :3")
		log.log(`Replied with :3`)
	} else if (/\b25004533\b/.test(message.content)) {
		message.delete()
		log.log("Replied by deleting")
	}
	let emojis = []
	if (/:rosy/.test(message.content)) {
		emojis.push("<@628654919439613995>")
	}
	if (/:ann/.test(message.content)) {
		emojis.push("<@773704059186053131>ww")
	}
	if (/:onion/.test(message.content)) {
		emojis.push("<@504080869384912906>")
	}
	if (/:drozos/.test(message.content)) {
		emojis.push("<@338724608062783489>")
	}
	if (/:chixie/.test(message.content)) {
		emojis.push("<@659810506139500554>")
	}
	if (/:tron/.test(message.content)) {
		emojis.push("<@853806216860663808>")
	}
	if (/:picky/.test(message.content)) {
		emojis.push("<@351443906585559041>")
	}
	if (/:snas/.test(message.content)) {
		emojis.push("<@254661838497644544>")
	}
	if (/:bungorf/.test(message.content)) {
		emojis.push("<@647568331913560073>")
	}
	if(/:Krock/.test(message.content)){
		emojis.push("<@513124467715866658>")
	}
	if (emojis.length > 0) {
		message.reply(emojis.join(" "))
	}

	if (message.content !== "ping") return;
	log.log("Ping button test sent")
	const first = new ButtonBuilder()
		.setCustomId("ButtONE")
		.setLabel("FIRST")
		.setStyle(ButtonStyle.Primary)
	const second = new ButtonBuilder()
		.setCustomId("ButtTWO")
		.setLabel("SECOND")
		.setStyle(3)
	const butts = new discordJs.ActionRowBuilder().addComponents(first, second)
	const reply = await message.reply({ content: "fuck you click one", components: [butts] })

	const filter = (i) => i.user.id == message.author.id

	const collection = reply.createMessageComponentCollector({
		componentType: ComponentType.Button,
		filter,
		time: 10_000
	})
	let butone = 0
	let buttwo = 0
	collection.on('collect', (interaction) => {
		switch (interaction.customId) {
			case "ButtONE":
				butone++
				message.reply(`button the first ${butone}`)
				break;
			case "ButtTWO":
				buttwo++
				message.reply(`button the second ${buttwo}`)
				break;
			default:
				message.reply("Not a button", interaction.customId)
				break;
		}
	})
	collection.on("end", async (interaction) => {
		first.setDisabled(true)
		second.setDisabled(true)
		const butts2 = new discordJs.ActionRowBuilder().addComponents(first, second)
		await reply.edit({ content: "ended", components: [butts2] })
	})
});

bot.on("interactionCreate", async (interaction) => {
	if (interaction.isChatInputCommand()) {
		console.log(
			`${interaction.user.username} command ${interaction.commandName}`
		);
		log.log(`${interaction.user.username} sent command ${interaction.commandName}`)
		switch (interaction.commandName) {
			case "schedule":
				const connect = interaction.options.get("connect").value;
				const date = interaction.options.get("date").value;
				const stv = interaction.options.get("stv").value;
				const team_name = interaction.options.get("team-name").value;
				console.log([connect, date, stv, team_name]);
				log.log("Got cmd inputs")
				try {
					const done = await send({
						connect: connect,
						date: date,
						stv: stv,
						team_name: team_name,
					});
					log.log("Sent to db")
					const dat = new Date(date);
					const em = new EmbedBuilder()
						.setTitle("Match scheduled")
						.setDescription(`Match #${done.number - 1}`)
						.addFields(
							{
								name: "Connect: ",
								value: done.info.connect,
								inline: true,
							},
							{
								name: "date: ",
								value: `<t:${parseInt(dat.getTime()) / 1000}:f>`,
								inline: true,
							},
							{
								name: "STV:",
								value: done.info.stv,
								inline: true,
							},
							{
								name: "Enemy team:",
								value: done.info.team_name,
								inline: true,
							}
						);
					console.log(`replied`);
					log.log("Replied")
					interaction.reply({
						ephemeral: false,
						embeds: [em],
					});
				} catch {
					(er) => {
						console.error(`erwhore haha you cnat send messages ${er}`);
					};
				}
				log.log("Command finished")
				break;
			case "matches":
				const match_num = interaction.options.get("match-number").value;
				try {
					await interaction.deferReply({ ephemeral: false });
					log.log("Defered reply")
					const info = await pullColl(db, "Matches");
					console.log(info);
					console.log("replying");
					if (info[`Match-${match_num}`] == undefined) {
						log.log("Match not found")
						interaction.editReply({
							ephemeral: true,
							content: "Match not found",
						});
						return;
					}
					const dat = new Date(info[`Match-${match_num}`].date);
					/*
					const down = new ButtonBuilder()
						.setCustomId("down")
						.setLabel("<<<<")
						.setStyle(ButtonStyle.Primary)
					const up = new ButtonBuilder()
						.setCustomId("up")
						.setLabel(">>>>")
						.setStyle(1)
					const row = new discordJs.ActionRowBuilder()
						.addComponents(down,up)
						*/
					let embed = new EmbedBuilder()
						.setTitle(`Match #${match_num}`)
						.setDescription("match info")
						.setFields({
							name: "Connect:",
							value: info["Match-", match_num].connect,
							inline: true,
						},
							{
								name: "Date:",
								value: `<t:${parseInt(dat.getTime()) / 1000}:f>`,
								inline: true,
							},
							{
								name: "STV: ",
								value: info["Match-", match_num].stv,
								inline: true,
							},
							{
								name: "Enemy team",
								value: info["Match-", match_num].team_name,
								inline: true,
							}
						);
					interaction.editReply({
						embeds: [embed],
						ephemeral: false,
						/*components:[row]*/
					});
					log.log("Replied")
				} catch {
					(error) => {
						console.error(error);
					};
				}
				break;
			case "pickle":
				interaction.reply({
					ephemeral: false,
					content:
						"https://cdn.discordapp.com/attachments/1186856764642181143/1202081721340932166/pickle.mov?ex=65cc28d7&is=65b9b3d7&hm=ae6ce6e0866426a718ce5943bd3bd7d3b0d6a072d270c13bfe21588beb55908d&",
				});
				log.log("replied")
				break;
			case "subs":
				interaction.reply({
					ephemeral: false,
					content: "NEED A SUB! <@&1201768882390433803>",
					files: ["./media/cucumper.jpg"],
				});
				log.log("Players pinged")
				break;
			case "edit":
				const num = interaction.options.get("match-number").value;
				const STV = interaction.options.get("stv");
				const Connect = interaction.options.get("connect");
				const tim = interaction.options.get("date");
				const ops = interaction.options.get("team-name");
				try {
					await interaction.deferReply({ ephemeral: false });
					log.log("Reply defered")
					console.log(`Match-` + num.toString());
					const def = await pull(db, "Matches", `Match-${num}`);
					if (def == undefined) {
						interaction.editReply({
							ephemeral: true,
							content: "Match info not found",
						});
					}
					console.log("match-" + num);
					let push = {
						connect: Connect?Connect.value:def.connect,
						stv: def.stv?STV.value:def.stv,
						date: tim?tim.value:def.time,
						team_name: ops?ops.value:def.team_name,
					};
					console.log(push);
					await db.collection("Matches")
						.doc(`Match-${num}`)
						.set(push)
						.then(() => {
							console.log("sent", push);
							log.log("Match info updated")
						})
						.catch((error) => {
							console.error(`erwhore: ${error}`);
							log.log("Update failed somewhere : " + error)
						});
					console.log(push)
					const embed = new EmbedBuilder()
						.setTitle(`Match #${num}`)
						.setDescription("match info")
						.setFields(
							{
								name: "Connect:",
								value: push.connect,
								inline: true,
							},
							{
								name: "Date:",
								value: `<t:${parseInt(new Date(push.date).getTime()) / 1000}:f>`,
								inline: true,
							},
							{
								name: "STV: ",
								value: push.stv,
								inline: true,
							},
							{
								name: "Enemy team",
								value: push.team_name,
								inline: true,
							}
						);
					console.log("here")
					log.log("replied")
					interaction.editReply({
						embeds: [embed],
						ephemeral: false,
					});
				} catch {
					(er) => {
						console.error(er);
					};
				}
				break;
			case "players":
				interaction.reply({
					content: "<@&1186055714054099014> get the fuck on NOW!!!!!",
					files: ["./media/pickle.png"],
				});
				log.log("Players pinged")
				break;
			case "refresh":
				await interaction.deferReply({ ephemeral: false })
				log.log("Defered reply")
				let test = await pinger(interaction.channel)
				log.log("Pinger refreshed/started")
				await interaction.editReply({ ephemeral: false, content: `${test.date}` })
				log.log("Replied")
				break;
			case "flip":
				let coin = Math.round(Math.random()) ? "heads" : "tails"
				interaction.reply(coin)
				log.log("Landed on " + coin)
				break;
			case "date":
				let d = new Date(interaction.options.get("date").value)
				interaction.reply(`<t:${Math.round(d.getTime()) / 1000}:f>`)
				log.log("Returned the date")
				break;
			default:
				interaction.reply({
					ephemeral: false,
					content: "dm rosy :)",
				});
				log.log("You fucked up the commands dingus")
				break;
		}
	}
	if (interaction.isButton()) {
		console.log(interaction.user.username, `HAS MADE AN EPIC BUTTON MOMENT AT ${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`)
		switch (interaction.customId) {
			case "down":
				interaction.channel.send("LEFT")
				break;
			case "up":
				interaction.channel.send("RIGHT")
				break;
		}
	}

});

bot.on("ready", () => {
	console.log("Working on the pickles");
	bot.user.setPresence({
		status: `online`,
		activities: [
			{
				name: "Working Pickle",
				type: ActivityType.Playing,
				state: "No we it is suffering",
			},
		],
	});
});
cmd.run(cmd.commands);
bot.login(process.env.TOKEN);