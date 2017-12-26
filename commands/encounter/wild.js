const Commando = require('discord.js-commando');
const axios = require('axios');
const pokemon = require('pokemon');
var moment = require('moment');
var format = require("moment-duration-format");
const database = 'https://masterbot-d874e.firebaseio.com/';

class WildPokemon extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'wild',
      group: 'encounter',
      memberName: 'wild',
      description: 'Inicia un encuentro contra algún pokémon salvaje.',
      examples: ['av!wild']
    });
  }

  async run(message, args) {

    var authorid = message.author.id;
    var wildPokemon = pokemon.random();
    var wildName = wildPokemon.toLowerCase();
    var wildId = pokemon.getId(wildPokemon);

    var actualFecha = moment().format('DD/MM/YYYY HH:mm:ss');

    var capturados = [];

    var i = Math.floor(Math.random() * 250) + 1;
    var shiny = false;

    if (i == 100) {
      shiny = true;
    } else {
      shiny = false;
    }

    if (shiny == true ) {
      if (wildId < 721) {
        var gif = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados-shiny/' + wildName +'.gif';
      } else {
        var gif = 'http://www.pkparaiso.com/imagenes/sol-luna/sprites/animados-shiny/' + wildName +'.gif';
      }
    } else {
      if (wildId < 721) {
        var gif = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/' + wildName + '.gif';
      } else {
        var gif = 'http://www.pkparaiso.com/imagenes/sol-luna/sprites/animados/' + wildName + '.gif';
      }
    }

    var pkmn = {
      id: wildId,
      captura: actualFecha,
      nombre: wildPokemon,
      shiny: shiny
    }

    axios.get(database + 'storage/' + authorid + '.json')
    .then(function (response) {

      for (let key in response.data) {
        capturados.push(response.data[key]);
      }

      if (response.data == undefined) {
        axios.put(database + 'storage/' + authorid + '/' + wildId + '.json', pkmn)
        .then(function (response) {
          if (shiny == true ) {
            message.reply(`¡Has capturado un **${wildPokemon}** variocolor, felicidades! ${gif}`);
          } else {
            message.reply(`¡Has capturado un **${wildPokemon}**, felicidades! ${gif}`);
          }
        })
        .catch(function (error) {
          message.reply(`Ocurrió un error y el comando no pudo ejecutarse exitosamente.`);
        });
      } else {
        var JSONFecha = capturados[capturados.length - 1].captura;
        var ms = moment(actualFecha, "DD/MM/YYYY HH:mm:ss").diff(moment(JSONFecha, "DD/MM/YYYY HH:mm:ss"));
        var date = moment.duration(ms);
        var tiempo = date.format("hh:mm:ss");

        var horas = tiempo.split(":");

        if (horas.length == 3) {
          if (horas[0] == 5) {
            axios.put(database + 'storage/' + authorid + '/' + wildId + '.json', pkmn)
            .then(function (response) {
              if (shiny == true ) {
                message.reply(`¡Has capturado un **${wildPokemon}** variocolor, felicidades! ${gif}`);
              } else {
                message.reply(`¡Has capturado un **${wildPokemon}**, felicidades! ${gif}`);
              }
            })
            .catch(function (error) {
              message.reply(`Ocurrió un error y el comando no pudo ejecutarse exitosamente.`);
            });
          } else {
            var horas = 4 - horas[0];
            var minutos = 59 - horas[0];
            var segundos = 59 - horas[1];
            message.reply(`Me temo que no puedes capturar a otro pokémon tan rápido. Tiempo restante: **${horas} horas, ${minutos} minutos y ${segundos} segundos.**`);
          }
        } else if (horas.length == 2) {
          var minutos = 59 - horas[0];
          var segundos = 59 - horas[1];
          message.reply(`Me temo que no puedes capturar a otro pokémon tan rápido. Tiempo restante: **4 horas, ${minutos} minutos y ${segundos} segundos.**`);
        } else {
          var segundos = 59 - horas[0];
          message.reply(`Me temo que no puedes capturar a otro pokémon tan rápido. Tiempo restante: **4 horas, 59 minutos y ${segundos} segundos.**`);
        }
      }

    })
    .catch(function (error) {
      console.log(error);
    });

  } // async
}

module.exports = WildPokemon;
