const {
	REST,
	Routes,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js");
const cmds = [
	{
		name: "schedule",
		description: "test plz work",
		options: [
			{
				name: "date",
				description: "input date (mm/dd/yy hour:minute)",
				type: ApplicationCommandOptionType.String,
				required: true,
			},{
				name: "connect",
				description: "put the connect command here",
				type: ApplicationCommandOptionType.String,
				required: true,
			},{
				name: "stv",
				description: "put the stv connect here",
				type: ApplicationCommandOptionType.String,
				required: true,
			},{
				name: "team-name",
				description: "put enemy team's name here",
				type: ApplicationCommandOptionType.String,
				required: true,
			},{
				name:"players",
				description: "Who is playing this time? put emojis of players if no emoji just put name",
				type: ApplicationCommandOptionType.String,
				require: true
			}
		],
	},
	{
		name: "matches",
		description: "get match info",
		options: [
			{
				name: "match-number",
				description: "get info on a specific match",
				type: ApplicationCommandOptionType.Number,
				required: true,
			}
		],
	},
	{
		name: "edit",
		description: "Edit match details",
		options: [
			{
				name: "match-number",
				description: "What match u gon edit HUH",
				type: ApplicationCommandOptionType.Number,
				required: true,
			},{
				name: "date",
				description: "input date (mm/dd/yy hour:minute)",
				type: ApplicationCommandOptionType.String,
				required: false,
			},{
				name: "connect",
				description: "put the connect command here",
				type: ApplicationCommandOptionType.String,
				required: false,
			},{
				name: "stv",
				description: "put the stv connect here",
				type: ApplicationCommandOptionType.String,
				required: false,
			},{
				name: "team-name",
				description: "put enemy team's name here",
				type: ApplicationCommandOptionType.String,
				required: false,
			},
		],
	},
	{
		name: "pickle",
		description: "Pickle i dont want no pickle",
	},
	{
		name: "subs",
		description: "PING THE SUBSSSSS (use at your discression)",
	},{
		name:"players",
		description: "PING THE PLAYERS",
	},
	{
		name: "refresh",
		description: "refresh the pinger",
	},{
		name:"flip",
		description:"flip a coin"
	},{
		name:"date",
		description:"Get and embed of local date",
		options:[{
			name:"date",
			description:"MM/DD/YYYY HH:MM",
			type: ApplicationCommandOptionType.String,
			required:true
		}]
		
	}
];

const run = async (cmds) => {
	rest = new REST().setToken(process.env.TOKEN);
	try {
		console.log("loadin :3");

		await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID,
				process.env.GUILD_ID
			),
			{
				body: cmds,
			}
		);
		console.log("CHILLIN");
	} catch (error) {
		console.log(`there was an error ${error}`);
	}
};
module.exports = {run,cmds};
