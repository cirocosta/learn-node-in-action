'use strict';

/**
 * Helper functions for the CHAT_UI, which implements the process for
 * the UI of the wepapp.
 */

var Chat = function (socket) {
    this.socket = socket;
};

/**
 * Sends a message to the 'message' event receiver at the serverside.
 */
Chat.prototype.sendMessage = function (room, text) {
    var message = {
        room: room,
        text: text
    };

    this.socket.emit('message', message);
};

/**
 * Sends a changeroom event to the 'join' receiver on the serverside.
 */
Chat.prototype.changeRoom = function(room) {
    this.socket.emit('join', {
        newRooms: room
    });
};

/**
 * Given a command, performs some kind of operation.
 * @returns {message} message.
 */
Chat.prototype.processCommand = function(command) {
    // asssign to words a list that is the strings from command
    // separated by a space.

    // command get the substring from index 1 till the end end
    // lowercases it.

    var words = command.split(' '),
        command = words[0].substring(1, words[0].length).toLowerCase(),
        message = false;

    switch(command) {
        case 'join':
            // releases the first element of the list
            words.shift();
            // joins all of the elements on the list
            var room = words.join(' ');
            this.changeRoom(room);
            break;

        case 'nick':
            words.shift();
            var name = words.join(' ');
            this.socket.emit('nameAttempt', name);
            break;

        default:
            message = 'UNrecognized command.';
            break;
    }

    return message;
};
