var WebSocketServer = require("websocket").server;
var http = require("http");
var DungeonCollapse = require('../shared/DungeonCollapse.js');

DungeonCollapse.Server = {

    /**
     * Global settings for the server
     */
    settings: {
        port: 1337
    },

    /**
     * Array with all connected clients. Each client has the following objects:
     * CLIENT_ID Int the id of itself and the key of the client array. @see numberOfClients
     * CLIENT_OPPONENT_ID Int the id of the opponent (default 0)
     * connection Object the websocket connection
     */
    clients: [],

    /**
     * Array with same informations as this.clients. After matching the pendingClient will
     * be removed.
     */
    pendingClients: [],

    /**
     * Unique identifier for this.clients
     */
    numberOfClients: 0,

    /**
     * Starts the server and start listening for incoming connections
     */
    init: function() {

        var server = http.createServer(function (request, response) {});
        server.listen(this.settings.port, function () {});

        var wsServer = new WebSocketServer({
            httpServer: server
        });
        wsServer.on("request", function (request) {
            DungeonCollapseServer.addClient(request);
        });

    },

    /**
     * Adds a player to this.clients[].
     * @param object the Websocket request
     */
    addClient: function(request) {

        var connection = request.accept(null, request.origin);
        var CLIENT_ID = this.numberOfClients;
        this.numberOfClients++;
        var client = {
            CLIENT_ID: CLIENT_ID,
            CLIENT_OPPONENT_ID: 0,
            connection: connection
        };
        if (this.pendingClients.length > 0) {
            // Match with waiting player
            var CLIENT_OPPONENT_ID = this.pendingClients[0].CLIENT_ID;
            this.pendingClients[0].CLIENT_OPPONENT_ID = CLIENT_ID;
            this.clients[CLIENT_ID] = client;
            this.clients[CLIENT_ID].CLIENT_OPPONENT_ID = CLIENT_OPPONENT_ID;
            this.clients[this.pendingClients[0].CLIENT_ID] = this.pendingClients[0];
            this.pendingClients.slice();
        }
        else {
            this.pendingClients.push(client);
        }

        connection.on("message", function(message) {

            DungeonCollapseServer.receiveMessage(message, CLIENT_ID);

        });

        connection.on("close", function(connection) {

            DungeonCollapseServer.removeClient(CLIENT_ID);

        });

    },

    /**
     * Removes the client from the game and send messages to opponent
     * @param CLIENT_ID
     */
    removeClient: function(CLIENT_ID) {

        var OPPONENT_ID = this.clients[CLIENT_ID].CLIENT_OPPONENT_ID;
        this.clients[CLIENT_ID] = null;
        if (OPPONENT_ID != 0) {
            this.chat(OPPONENT_ID, 'Opponent left...');
        }

    },

    /**
     * Receives and process a message from the server.
     * @param string message contains a JSON stringify object with at least a topic param
     * @param int CLIENT_ID the id of the client that sent the message
     */
    receiveMessage: function (message, CLIENT_ID) {

        message = message.utf8Data;
        message = JSON.parse(message);
        switch (message.topic) {
            case 'chat':
              DungeonCollapseServer.chat(
                this.clients[CLIENT_ID].CLIENT_OPPONENT_ID,
                message.message
              );
            break;
        }

    },

    /**
     * Sents a chat message to a client.
     * @parem int CLIENT_ID the id of the receiver
     * @param string message the message to send.
     */
    chat: function(CLIENT_ID, message) {

        if (this.clients[CLIENT_ID] != null && message != '') {
            return this.clients[CLIENT_ID].connection.send(JSON.stringify({topic:'chat',message:message}));
        }
        return false;

    }
};

DungeonCollapse.Server.init();