const Token = 'Mzk0OTYyNzU4NDA1MTkzNzQ4.DSL_cg.xjXp_3KObJRzGs3ZKwhCU6CHAgo';
const Commando = require('discord.js-commando');
const Bot = new Commando.Client();

Bot.registry.registerGroups([
  ['encounter', 'Encounter'],
  ['data', 'Information']
]);

Bot.registry.registerDefaults();
Bot.registry.registerCommandsIn(__dirname + "/commands");

Bot.login(Token);
