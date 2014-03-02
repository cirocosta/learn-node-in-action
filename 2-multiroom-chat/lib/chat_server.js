'use strict';

/**
 * Implements the functionality of the multiroom chat. Basically all of
 * the operations that regards socketio are implemented here.
 */

var socketio = require('socket.io'),
    io,                     // the io server
    guestNumber = 1,        // number of guests
    nickNames = {},         // map between name and client id
    namesUsed = [],         // names used in the app
    currentRoom = {};       // mapping rooms to client ids

/**
 * Starts SocketIO server, limits the verbosity of socketsio's loging to
 * the console and establishes how each incoming should be handled.
 * @param  {Server} server An HTTP server that was started.
 */
exports.listen = function (server) {
    // start socketio server allowing to piggyback on existing http
    // server
    io = socketio.listen(server);
    // io.set('log level', 1);

    // When a socket connection is stablished
    io.sockets.on('connection', function (socket) {
        // The connection was successfully made. Now listen to messages
        // to be received and to whatever it needs.

        // Assign user a guest name when they connect

        guestNumber = assignGuestName(socket, guestNumber, nickNames,
                                      namesUsed);

        // Put the user in the Lobby room so that he is able to listen
        // to what people are saying there.

        joinRoom(socket, 'Lobby');

        // Handle user messages, namechange attemps, and room creation
        // changes

        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        // Provide user with list of occupied rooms on request.

        socket.on('rooms', function () {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        // Cleanup logic for user disconnection.

        handleClientDisconnection(socket, nickNames, namesUsed);

    });
}

//////////////////////////////////////////////////////////////////////////
// SUPPORT METHODS : Guest name Assignment, Room-change requests, Name- //
// change request, Sending chat messages, Room creation, User           //
// disconnection                                                        //
//////////////////////////////////////////////////////////////////////////

/**
 * Stores the guest name and returns it to the socket user
 */
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest ' + guestNumber;  // create a name
    nickNames[socket.id] = name;  // store the name mapping to client id
    socket.emit('nameResult', {   // emit the name back to the user
        success: true,
        name: name
    });
    namesUsed.push(name);         // store the name again
    return guestNumber + 1;       // update guest counter
}

/**
 * Register the user to a specific room. If the user just joined the
 * chat, it will be assigned to the default ('lobby').
 */
function joinRoom(socket, room) {
    // Put the client into a room
    socket.join(room);
    // set the current room of that client to the room
    currentRoom[socket.id] = room;
    // emit to the client the room joining
    socket.emit('joinResult', {room: room});
    // broadcast that the user entered the room
    socket.broadcast.to(room).emit('message', {
        test: nickNames[socket.id] + ' has joined ' + room + '.'
    });
    // get all the clinets in the room
    var usersInRooms = io.sockets.clients(room);
    if (usersInRooms.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRooms) {
            var userSocketId = usersInRooms[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message', {text: usersInRoomSummary});
    }
}

/**
 * Handles the attemps to change a name. It listens to the 'nameAttempt'
 * event and then check if it is possible to assign a specific name to
 * the user. Then it returns what was the result of the attempt.
 */
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
//listens to the 'nameAttempt' event.
  socket.on('nameAttempt', function(name) {
    // checks if there is a Guest substring in the name that the users
    // tried to use.
    if (name.indexOf('Guest') == 0) {
        // if it has, returns a false message.
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      });
    } else {
        // if there's no Guest substring in the new name, check if the
        // name is already in use or not.
      if (namesUsed.indexOf(name) == -1) {
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];
        socket.emit('nameResult', {
          success: true,
          name: name
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known as ' + name + '.'
        });
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        });
      }
    }
  });
}

/**
 * Handles the message broadcasting. That is, the message that a user
 * broadcasts get broadcasted to everyone in the room but not him.
 */
function handleMessageBroadcasting(socket) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    });
  });
}


/**
 * Handles the room joining event. It unregisters the user from the old
 * current and joins the user in the new one.
 */
function handleRoomJoining(socket) {
  socket.on('join', function(room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}

/**
 * Handles the event of a user disconnecting from the sys.
 */
function handleClientDisconnection(socket) {
    // registers for the 'disconnect' event

    console.log("\n---\njust diconnected: " + socket.id + "\n\n");
  socket.on('disconnect', function() {
    // get the index of the name of the user that just disconnected
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);

    // removes the user from the storage.

    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
}


///////////
// ROOMS //
///////////

// Rooms allow simple partitioning of the connected clients. This allows
// events to be emitted to subsets of the connected client list, and
// gives a simple method of managing them.  A list of all rooms can be
// found by looking in `io.sockets.manager.rooms`, a hash, with the room
// name as a key to an array of socket IDs. If you want a list of
// clients in a particular room, call `io.sockets.clients('room')`. You
// can get a dictionary of rooms a particular client socket has joined
// by looking in `io.sockets.manager.roomClients[socket.id]`.

///////////////
// BROADCAST //
///////////////

// Broadcasts are sent from a socket object and are received by all
// clients in the room except for the emitting socket
