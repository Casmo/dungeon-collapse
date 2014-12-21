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
        console.log('Init server');

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

            console.log('Nieuw client logged in: ' + CLIENT_ID);

            connection.on("message", function(message) {

                console.log('Connection message: ' + message + ' From client: ' + CLIENT_ID);
                DungeonCollapseServer.receiveMessage(message, CLIENT_ID);
            });

            connection.on("close", function(connection) {
                console.log('Connection closed');
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

        var CLIENT_ID = this.numberOfClients;
        this.numberOfClients++;
        var client = {
            CLIENT_ID: CLIENT_ID,
            CLIENT_OPPONENT_ID: 0,
            connection: connection,
            var1: Math.random() * 10000
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
        return CLIENT_ID;

    },

    removeClient: function(CLIENT_ID) {

        var message = JSON.stringify({message:'Opponent left'});
        this.clients[CLIENT_ID] = null;
        //this.sendMessage(message, OPPONENT_ID);

    },

    /**
     * Receives and process a message from the server.
     * @param message
     * @param CLIENT_ID
     */
    receiveMessage: function (message, CLIENT_ID) {

        message = message.utf8Data;
        message = JSON.parse(message);
        console.log('hier');
        console.log(message.topic);
        console.log(message.message);
        console.log(CLIENT_ID);
        var opponent = this.clients[CLIENT_ID].CLIENT_OPPONENT_ID;
        console.log(opponent);
        this.clients[opponent].connection.send(JSON.stringify({topic:message.topic,message:message.message}));

    }

};

DungeonCollapseServer.init();