'use strict';

const fs = require('fs');
const Clapp = require('./modules/clapp-discord');
const cfg = require('../config.js');
const pkg = require('../package.json');
const Discord = require('discord.js');
var say = require('../say');
const shortid = require('shortid');
const bot = new Discord.Client();

var app = new Clapp.App({
	name: cfg.name,
	desc: pkg.description,
	prefix: cfg.prefix,
	version: pkg.version,
	separator: "",
	onReply: (msg, context) => {
		// Fired when input is needed to be shown to the user.

		if ( context.fileName ) {
			fs.access(context.fileName, fs.constants.F_OK, (err) => {
				if (err) {
					console.log( 'err: ', err )
				}
				else {
					let connection = bot.voiceConnections.first();
					connection.playFile(context.fileName);
				}
				setTimeout(function(){
					fs.unlink(context.fileName, () => {
					});
				}, 10000)
			})
		}

		var ctx = context.msg || context.ctx;

		if ( ctx.msg ) {
			ctx.msg.reply('\n' + msg.status).then(bot_response => {
				if (cfg.deleteAfterReply.enabled) {
					ctx.msg.delete(cfg.deleteAfterReply.time)
						.then(msg => console.log(`Deleted message from ${msg.author}`))
						.catch(console.log);
					bot_response.delete(cfg.deleteAfterReply.time)
						.then(msg => console.log(`Deleted message from ${msg.author}`))
						.catch(console.log);
				}
			});
		}
	}
});

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
	app.addCommand(require("./commands/" + file));
});

bot.on('ready', () => {
	let channel = bot.channels.find('name', 'Tutaj sie gada');

	channel.join()
		.then(connection => {
			console.log('Connected!');
		})
		.catch(console.error);
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
	if ( newMember.voiceChannelID == '254185944285052929' && oldMember.voiceChannelID != '254185944285052929' ){
		var tempFilename = './wav/' + shortid.generate() + '.wav';
		/*say.export('Siema ' + newMember.user.username +'!', 'Alex', 0.5, tempFilename, function(err){
			let connection = bot.voiceConnections.first();
			connection.playFile(tempFilename);
			setTimeout(function(){
				fs.unlink(tempFilename, () => {
				});
			}, 10000)
		})*/
	}
});

bot.on('message', msg => {
	// Fired when someone sends a message
	if (app.isCliSentence(msg.content)) {
		app.parseInput(msg.content, {
			msg: msg
			// Keep adding properties to the context as you need them
		});
	}
});

bot.login(cfg.token).then(() => {
	console.log('Running!');
});
