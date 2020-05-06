const axios = require('axios');

module.exports = getSteamPlayTime = (username) => {
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