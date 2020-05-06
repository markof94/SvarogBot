const axios = require('axios');

module.exports = sendACat = (channel) => {
    channel.send("Searching for a cat...");

    axios.get('https://api.thecatapi.com/v1/images/search?size=full')
        .then(response => {
            const imageUrl = response.data[0].url;
            channel.send("Found a cat!", { files: [imageUrl] });
        })
        .catch(error => {
            console.log(error);
        });
}