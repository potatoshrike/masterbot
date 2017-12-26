const Commando = require('discord.js-commando');
const axios = require('axios');
const pokemon = require('pokemon');
var moment = require('moment');
const database = 'https://masterbot-d874e.firebaseio.com/';

class UserStorage extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'storage',
      group: 'data',
      memberName: 'storage',
      description: 'Muestra los pokémon capturados por el usuario.',
      examples: ['av!storage']
    });
  }

  async run(message, args) {

    var authorid = message.author.id;
    var author = message.author;
    var fecha = moment().format('DD/MM/YYYY HH:mm:ss');

    var capturados = [];

    axios.get(database + '/storage/' + authorid + '.json')
    .then(function (response) {
      for (let key in response.data) {
        capturados.push(response.data[key]);
      }

      var msg = '';

      for (let key in capturados) {
        if (key == (capturados.length - 1 )) {
          msg = msg + capturados[key].nombre + '.';
        } else {
          msg = msg + capturados[key].nombre + ', ';
        }
      }

      message.channel.send(`Pokémon capturados por **${author}**: \n\n${msg}`);

    })
    .catch(function (error) {
      message.reply(`No pude conectarme a la base de datos. Intenta más tarde.`);
    });

  }
}

module.exports = UserStorage;
