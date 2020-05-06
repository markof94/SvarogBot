module.exports = punch = (message) => {
    const author = message.author;
    const isAnyoneMentioned = message.mentions.users.first() !== undefined;

    if (!isAnyoneMentioned) {
        doRandomPunch(author, message);
    } else {
        const taggedUser = message.mentions.users.first();
        punchUser(author, taggedUser, message.channel);
    }
}

function punchUser(author, taggedUser, channel) {
    channel.send(`${author} punched ${taggedUser}`);
}

function doRandomPunch(author, message) {
    const randomMember = message.guild.members.cache.random();
    if(randomMember.id === author.id){
        message.channel.send(`${author} missed and punched himself in the face!`);
    }else{
        punchUser(author, randomMember, message.channel);
    }
}
