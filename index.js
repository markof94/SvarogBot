const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');

const prefix = "!";

client.once('ready', () => {
    console.log('Ready!');
});

client.login('NzA2NjIzMDQxNzk4NjY4NDE5.Xq886A.8g4q-EX4zmQg_UHPTZMVdv2mROY');

client.on('message', message => {
    handleCommand(message);
});

function handleCommand(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'punch') {
        const taggedUser = message.mentions.users.first();

        message.channel.send(`${message.author} punched ${taggedUser}`);
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

    function sendAFortune(channel) {
        axios.get('https://fortunecookieapi.herokuapp.com/v1/fortunes?limit=&skip=&page=')
            .then(response => {
                const allFortunes = response.data;
                const chosenFortune = allFortunes[Math.floor(Math.random() * allFortunes.length)].message;
                console.log(chosenFortune);
                channel.send(chosenFortune);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function sendACat(channel) {
        axios.get('https://api.thecatapi.com/v1/images/search?size=full')
            .then(response => {
                const imageUrl = response.data[0].url;
                channel.send("Here's a cat", { files: [imageUrl] });
            })
            .catch(error => {
                console.log(error);
            });
    }

    function getSteamPlayTime(username) {
        const key = "2AB0B7EBE4473A2C777E96681E3B83E6";

        axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=2AB0B7EBE4473A2C777E96681E3B83E6&vanityurl=${username}`)
            .then(response => {
                const id = response.data.response.steamid;
                axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${id}&format=json`)
                    .then(response => {
                        const games = response.data.response.games;
                        let totalPlayTime = 0;

                        for (let i = 0; i < games.length; i++) {
                            totalPlayTime += games[i].playtime_forever;
                        }
                        message.channel.send("Total Steam play time: " + totalPlayTime + " minutes.");
                    })
                    .catch(error => { 
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }
}