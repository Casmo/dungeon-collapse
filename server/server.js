var WebSocketServer = require("websocket").server;
var http = require("http");

var DungeonCollapseServer = {

    /**
     * Array with all connected clients
     */
    pendingClients: [],
    clients: [],

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

            var connection = request.accept(null, request.origin);

            var CLIENT_ID = DungeonCollapseServer.addClient(connection);

            connection.on("message", function(message) {
                DungeonCollapseServer.sendMessage(message, CLIENT_ID);
            });

            connection.on("close", function(connection) {
                DungeonCollapseServer.removeClient(CLIENT_ID);
            });

        });

    },

    /**
     * Adds a client to the game. Match it directly if a pending client is waiting.
     * @param connection
     * @return int the unique id of the client
     */
    addClient: function (connection) {

        var CLIENT_ID = this.clients.length;
        var client = {
            CLIENT_ID: CLIENT_ID,
            CLIENT_OPPONENT_ID: 0,
            connection: connection,
            var1: Math.random() * 10000
        };
        if (this.pendingClients.length > 0) {
            // Match with waiting player
            var CLIENT_OPPONENT_ID = this.clients.length + 1;
            this.pendingClients[0].CLIENT_OPPONENT_ID = CLIENT_ID;
            this.clients[CLIENT_ID] = client;
            this.clients[CLIENT_ID].CLIENT_OPPONENT_ID = CLIENT_OPPONENT_ID;
            this.clients.push(this.pendingClients[0]);
            this.pendingClients.slice();
        }
        else {
            this.pendingClients.push(client);
        }
        return CLIENT_ID;

    },

    removeClient: function(CLIENT_ID) {

        var message = JSON.stringify({message:'Opponent left'});
        
        this.sendMessage(message, OPPONENT_ID);

    },

    /**
     * Sends a message with json to a client
     * @param message
     * @param CLIENT_ID
     */
    sendMessage: function (message, CLIENT_ID) {

        console.log(message, CLIENT_ID);
        var connection = this.clients[CLIENT_ID].connection;

    }

};

DungeonCollapseServer.init();