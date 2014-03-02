'use strict';
/**
 * Implements whats going on with the UI. Uses the helper functions from
 * CHAT.JS to communicate properly with the server.
 */

/**
 * Escapes the content from the message parameter.
 */
function divEscapedContentElement (message) {
    return $('<div></div>').text(message);
}

/**
 * Don't escape the messages that come from the system as they are
 * considered safe.
 */
function divSystemContentElement (message) {
    return $('<div></div>').html("<i>" + message + "</i>");
}

/**
 * Process the user messages. i.e, decides if it is just a simple
 * message to be sent over the socketio connection or if it is a command
 * to be executed.
 */
function processUserInput(chatApp, socket) {
    // gets the value of the send-message input
    var message = $('#send-message').val(),
        systemMessage;

        // verifies if it starts with a '/' or not.
  if (message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('#room').text(), message);
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }

  $('#send-message').val('');
}

// instantiate the socket element.
var socket = io.connect();

/**
 * What to do when the full page has just loaded.
 */
$(document).ready(function() {
    // instantiate the Chat element from chat.js, wich will provide us
    // some helper functions for interacting with the server through
    // socket.io
  var chatApp = new Chat(socket);

  //register for the 'nameResult' event that might come from the server
  //thorugh socket.io
  socket.on('nameResult', function(result) {
    var message;

    // verify if it was successful

    if (result.success) {
      message = 'You are now known as ' + result.name + '.';
    } else {
      message = result.message;
    }

    // put that message in the content area.

    $('#messages').append(divSystemContentElement(message));
  });

  // register for the joinResult event.

  socket.on('joinResult', function(result) {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });

  // register for the messageEvent.

  socket.on('message', function (message) {
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  // register for the 'rooms' event.

  socket.on('rooms', function(rooms) {
    $('#room-list').empty();

    for(var room in rooms) {
      room = room.substring(1, room.length);
      if (room != '') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }

    $('#room-list div').click(function() {
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').focus();
    });
  });

  setInterval(function() {
    socket.emit('rooms');
  }, 1000);

  $('#send-message').focus();

  $('#send-form').submit(function() {
    processUserInput(chatApp, socket);
    return false;
  });
});

