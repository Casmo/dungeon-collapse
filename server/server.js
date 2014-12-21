var WebSocketServer = require("websocket").server;
var http = require("http");

var DungeonCollapseServer = {

    /**
     * Array with all connected clients
     */
    pendingClients: [],
    clients: [],
    numberOfClients: 0,

    init: function() {

        var server = http.createServer(function (request, response) {});
        server.listen(1337, function () {});

        var wsServer = new WebSocketServer({
            httpServer: server
        });

        /**
         * Callback when player makes connection
         */
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

            console.log('Connection message: ' + message + ' From client: ' + CLIENT_ID);
            DungeonCollapseServer.receiveMessage(message, CLIENT_ID);

        });

        connection.on("close", function(connection) {

            console.log('Connection closed');
            DungeonCollapseServer.removeClient(CLIENT_ID);

        });
    },

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

DungeonCollapseServer.init();