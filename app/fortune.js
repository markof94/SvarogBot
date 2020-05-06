const axios = require('axios');

module.exports = sendAFortune = (channel) => {
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
