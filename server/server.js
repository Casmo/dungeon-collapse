var Settings = (function () {
    function Settings() {
        this.port = 1337;
    }
    return Settings;
})();
/// <reference path="dts/node.d.ts"/>
var DungeonCollapse;
(function (DungeonCollapse) {
    revision: 1;
})(DungeonCollapse || (DungeonCollapse = {}));
/// <reference path="references.ts"/>
var WebSocketServer = require("websocket").server;
var http = require("http");
var DungeonCollapse;
(function (DungeonCollapse) {
    var Server = (function () {
        /**
         * Starts the server and start listening for incoming connections
         */
        function Server() {
            this.clients = [];
            this.Chat = new DungeonCollapse.Chat();
            this.settings = new Settings();
            var self = this;
            var server = http.createServer(function (request, response) {
            });
            server.listen(this.settings.port, function () {
            });
            console.log('Server running on port: ' + this.settings.port);
            var wsServer = new WebSocketServer({
                httpServer: server
            });
            wsServer.on("request", function (request) {
                var cookies = self.parseCookie(request);
                if (cookies.CLIENT_ID == null) {
                    console.log(request.cookies);
                    var CLIENT_ID = Math.floor((1 + Math.random()) * 0x10000) + '' + Math.floor((1 + Math.random()) * 0x10000) + '' + Math.floor((1 + Math.random()) * 0x10000) + '' + Math.floor((1 + Math.random()) * 0x10000);
                }
                self.addClient(request, CLIENT_ID);
            });
        }
        /**
         * Adds a player to this.clients[].
         * @param request object the Websocket request
         * @todo check with cookie if client already is in the list
         */
        Server.prototype.addClient = function (request, CLIENT_ID) {
            var self = this;
            var connection = request.accept(null, request.origin);
            var client = {
                connection: connection,
                name: 'Anonymous (' + (this.clients.length + 1) + ')',
                connected: true
            };
            if (this.clients[CLIENT_ID] != null) {
                for (var attr in this.clients[CLIENT_ID]) {
                    client[attr] = client[attr];
                }
            }
            connection.on("message", function (message) {
                self.receiveMessage(message, CLIENT_ID);
            });
            connection.on("close", function (connection) {
                self.removeClient(CLIENT_ID);
            });
            this.clients[CLIENT_ID] = client;
        };
        /**
         * Removes the client from the game and send messages to opponent
         * @param CLIENT_ID
         */
        Server.prototype.removeClient = function (CLIENT_ID) {
            console.log('Client disconnected: ' + CLIENT_ID);
            this.clients[CLIENT_ID].connected = false;
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
                    this.Chat.chat(CLIENT_ID, this.clients[CLIENT_ID].CLIENT_OPPONENT_ID, message.message);
                    break;
            }
        };
        /**
         * Parse all cookies from a request
         * @param request
         */
        Server.prototype.parseCookie = function (request) {
            var list = [], rc = request.cookie;
            rc && rc.split(';').forEach(function (cookie) {
                var parts = cookie.split('=');
                list[parts.shift().trim()] = decodeURI(parts.join('='));
            });
            return list;
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
            this.Server = DungeonCollapse.Server;
        }
        /**
         * Sends a chat message to a client.
         * @param CLIENT_ID number the id of the sender
         * @param CLIENT_ID number the id of the receiver. If empty sends to all
         * @param message string the message to send.
         */
        Chat.prototype.chat = function (FROM_CLIENT_ID, message, CLIENT_ID) {
            if (message == '') {
                return false;
            }
            if (CLIENT_ID == null || CLIENT_ID == '') {
                for (var ID in this.Server.clients) {
                    if (this.Server.clients[ID].connected == true) {
                        this.Server.clients[CLIENT_ID].connection.send(JSON.stringify({
                            topic: 'chat',
                            message: message,
                            from: this.Server.clients[ID].name
                        }));
                    }
                }
                return true;
            }
            if (this.Server.clients[CLIENT_ID] != null && message != '') {
                if (this.Server.clients[CLIENT_ID].connection.send(JSON.stringify({
                    topic: 'chat',
                    message: message,
                    from: this.Server.clients[FROM_CLIENT_ID].name
                }))) {
                    return true;
                }
            }
            return false;
        };
        return Chat;
    })();
    DungeonCollapse.Chat = Chat;
})(DungeonCollapse || (DungeonCollapse = {}));
/// <reference path="references.ts"/>
var server = new DungeonCollapse.Server();
//# sourceMappingURL=server.js.map