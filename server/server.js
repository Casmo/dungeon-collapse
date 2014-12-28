var Settings = (function () {
    function Settings() {
        this.port = 1337;
    }
    return Settings;
})();
/// <reference path="dts/node.d.ts"/>
var DungeonCollapse;
(function (DungeonCollapse) {
    revision:
    1;
})(DungeonCollapse || (DungeonCollapse = {}));
/// <reference path="references.ts"/>
var settings;
var WebSocketServer = require("websocket").server;
var http = require("http");

var DungeonCollapse;
(function (DungeonCollapse) {
    var Server = (function () {
        /**
        * Starts the server and start listening for incoming connections
        */
        function Server() {
            settings = new Settings();
            var server = http.createServer(function (request, response) {
            });
            server.listen(settings.port, function () {
            });

            var wsServer = new WebSocketServer({
                httpServer: server
            });
            wsServer.on("request", function (request) {
                console.log(request);
                _super.prototype.addClient.call(this, request);
            });
        }
        /**
        * Adds a player to this.clients[].
        * @param object the Websocket request
        * @todo check with cookie if client already is in the list
        */
        Server.prototype.addClient = function (request) {
            var connection = request.accept(null, request.origin);
            var CLIENT_ID = this.clients.length;
            var client = {
                CLIENT_ID: CLIENT_ID,
                CLIENT_OPPONENT_ID: 0,
                connection: connection
            };

            connection.on("message", function (message) {
                _super.prototype.receiveMessage.call(this, message, CLIENT_ID);
            });

            connection.on("close", function (connection) {
                _super.prototype.removeClient.call(this, CLIENT_ID);
            });
        };

        /**
        * Removes the client from the game and send messages to opponent
        * @param CLIENT_ID
        */
        Server.prototype.removeClient = function (CLIENT_ID) {
            this.clients[CLIENT_ID] = null;
        };

        /**
        * Receives and process a message from the server.
        * @param string message contains a JSON stringify object with at least a topic param
        * @param int CLIENT_ID the id of the client that sent the message
        */
        Server.prototype.receiveMessage = function (message, CLIENT_ID) {
            message = message.utf8Data;
            message = JSON.parse(message);
            switch (message.topic) {
                case 'chat':
                    DungeonCollapse.Chat.chat(this.clients[CLIENT_ID].CLIENT_OPPONENT_ID, message.message);
                    break;
            }
        };
        return Server;
    })();
    DungeonCollapse.Server = Server;
})(DungeonCollapse || (DungeonCollapse = {}));
/// <reference path="references.ts"/>
var DungeonCollapse;
(function (DungeonCollapse) {
    var Chat = (function () {
        function Chat() {
        }
        /**
        * Sends a chat message to a client.
        * @parem int CLIENT_ID the id of the receiver
        * @param string message the message to send.
        */
        Chat.prototype.chat = function (CLIENT_ID, message) {
            if (DungeonCollapse.Server.clients[CLIENT_ID] != null && message != '') {
                if (DungeonCollapse.Server.clients[CLIENT_ID].connection.send(JSON.stringify({ topic: 'chat', message: message }))) {
                    return true;
                }
            }
            return false;
        };
        return Chat;
    })();
    DungeonCollapse.Chat = Chat;
})(DungeonCollapse || (DungeonCollapse = {}));
/// <reference path="Settings.ts"/>
/// <reference path="../shared/DungeonCollapse.ts"/>
/// <reference path="DungeonCollapse.Server.ts"/>
/// <reference path="DungeonCollapse.Chat.ts"/>
/// <reference path="references.ts"/>
var server = new DungeonCollapse.Server();
//# sourceMappingURL=server.js.map
