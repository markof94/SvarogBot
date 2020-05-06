const ytdl = require('ytdl-core');

class MusicPlayer {
    constructor(client) {
        this.servers = [];
        this.client = client;
        this.voiceChannel = null;
    }

    commandPlay(message, url) {
        if (!url || !message.guild) return;

        this.voiceChannel = message.member.voice.channel;

        if (!this.voiceChannel) {
            message.channel.send("You must be in a music channel to play the bot!");
            return;
        }

        this.createServerIfItDoesNotExist(message);
        this.addSongToQueue(message, url);
    }

    createServerIfItDoesNotExist(message) {
        if (!this.servers[message.guild.id]) this.servers[message.guild.id] = { queue: [] }
    }

    addSongToQueue(message, url) {
        this.getCurrentServer(message).queue.push(url);
        if (!this.getCurrentServer(message).currentSong) this.connectAndPlaySong(message, url);
    }

    connectAndPlaySong(message, url) {
        this.getCurrentServer(message).currentSong = url;
        const clientVoice = this.client.voice.channel;
        if (!clientVoice) this.voiceChannel.join().then(connection => { this.attemptPlayback(connection, message) })
    }

    attemptPlayback(connection, message) {
        try {
            this.play(connection, message);
        } catch{
            message.channel.send("Error, try again!");
        }
    }

    play(connection, message) {
        const server = this.getCurrentServer(message);
        server.dispatcher = connection.play(ytdl(server.currentSong, { quality: 'highestaudio' }));
        server.connection = connection;
        server.queue.shift();

        server.dispatcher.on("finish", () => {
            server.currentSong = null;

            if (server.queue.length > 0) {
                server.currentSong = server.queue[0];
                this.attemptPlayback(server.connection, message);
            } else {
                this.disconnectFromVoice(server);
            }
        });
    }

    commandSkip(message) {
        const server = this.getCurrentServer(message);
        if (!server || !server.dispatcher) return;

        server.dispatcher.end();
        message.channel.send("Skipping song.");
    }

    commandStop(message) {
        const server = this.getCurrentServer(message);
        if (!server || !server.dispatcher) return;

        server.queue = [];
        server.currentSong = null;
        server.dispatcher.end();
        message.channel.send("Stop the music.");

        this.disconnectFromVoice(server);
    }

    disconnectFromVoice(server) {
        if (server.connection) server.connection.disconnect();
    }

    commandPause(message) {
        const server = this.getCurrentServer(message);
        if (!server || !server.dispatcher) return;

        server.dispatcher.pause(true);
        message.channel.send("Pausing song.");
    }

    commandResume(message) {
        const server = this.getCurrentServer(message);

        if (!server || !server.dispatcher) return;

        server.dispatcher.resume();
        message.channel.send("Resuming song.");
    }

    getCurrentServer(message) {
        return this.servers[message.guild.id];
    }
}

module.exports = MusicPlayer;