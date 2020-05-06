const sendACat = require('./cat');
const sendAFortune = require('./fortune');
const getSteamPlayTime = require('./steam');
const punch = require('./interactions');
const MusicPlayer = require('./music');
const {clientID} = require('./config');

const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = "!";

const musicPlayer = new MusicPlayer(client);

client.once('ready', () => {
    console.log('Ready!');

});

client.login(clientID);

client.on('message', message => {
    handleCommand(message);
});

function handleCommand(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'punch') {
        punch(message);
    }

    if (command === 'fortune') {
        sendAFortune(message.channel);
    }

    if (command === 'cat') {
        sendACat(message.channel);
    }

    if (command === 'steam') {
        const username = args[0];
        getSteamPlayTime(username);
    }

    if (command === 'yt') musicPlayer.commandPlay(message, args[0]);
    if (command === 'skip') musicPlayer.commandSkip(message);
    if (command === 'pause') musicPlayer.commandPause(message);
    if (command === 'resume') musicPlayer.commandResume(message);
    if (command === 'stop') musicPlayer.commandStop(message);
}


