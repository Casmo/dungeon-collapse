var WebSocketServer = require("websocket").server;
var http = require("http");

DungeonCollapse.Server = {

    settings: {
        port: 1337
    },

    /**
     * Array with all connected clients. Each client has the following attributes:
     * @attribute name string The name/nick of the client
     * @attribute connection Object: The request connection object
     * @attribute connected boolean whether the player is connected or not
     */
    clients: [],

    /**
     * Array with games
     */
    games: [],

    /**
     * Starts the server and start listening for incoming connections
     */
    start: function () {

        this.clients = [];
        this.games = [];
        var server = http.createServer(function (request, response) {
        });
        server.listen(this.settings.port, function () {
        });

        console.log('Server running on port: ' + this.settings.port);

        var wsServer = new WebSocketServer({
            httpServer: server
        });

        wsServer.on("request", function (request) {
            var cookies = DungeonCollapse.Server._parseCookie(request);
            if (cookies.CLIENT_ID == null) {
                var CLIENT_ID = Math.floor((1 + Math.random()) * 0x10000) + '' + Math.floor((1 + Math.random()) * 0x10000) + '' + Math.floor((1 + Math.random()) * 0x10000) + '' + Math.floor((1 + Math.random()) * 0x10000);
            }
            DungeonCollapse.Server.addClient(request, CLIENT_ID);
        });

    },


    /**
     * Adds a player to this.clients[].
     * @param request object the Websocket request
     */
    addClient: function (request, CLIENT_ID) {

        var connection = request.accept(null, request.origin);
        var client = {
            connection: connection,
            name: 'Guest (' + (Object.keys(this.clients).length + 1) + ')',
            connected: true
        };

        if (this.clients[CLIENT_ID] != null) {
            for (var attr in this.clients[CLIENT_ID]) {
                client[attr] = client[attr];
            }
        }

        connection.on("message", function (message) {

            DungeonCollapse.Server.receiveMessage(message, CLIENT_ID);

        });

        connection.on("close", function (connection) {

            DungeonCollapse.Server.removeClient(CLIENT_ID);

        });

        this.clients[CLIENT_ID] = client;
        console.log('Client ('+ Object.keys(this.clients).length +') added: ' + CLIENT_ID);

    },

    /**
     * Removes the client from the game and send messages to opponent
     * @param CLIENT_ID
     */
    removeClient: function (CLIENT_ID) {

        console.log('Client disconnected: ' + CLIENT_ID);
        this.clients[CLIENT_ID].connected = false;

    },

    /**
     * Receives and process a message from the server.
     * @param message object message contains a JSON stringify object with at least a topic param
     * @param CLIENT_ID string the id of the client that sent the message
     */
    receiveMessage: function (message, CLIENT_ID) {

        message = message.utf8Data;
        message = JSON.parse(message);
        console.log('Message received from client: ' + CLIENT_ID);
        console.log(message);
        switch (message.topic) {
            case 'chat':
                DungeonCollapse.Chat.chat(
                    CLIENT_ID,
                    message.message
                );
                break;

            default:
                console.log('Warning: Topic not implemented: ' + topic);
        }

    },

    /**
     * Parse all cookies from a request
     * @param request
     */
    _parseCookie: function (request) {

        var list = [],
            rc = request.cookie;

        rc && rc.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return list;

    }

};