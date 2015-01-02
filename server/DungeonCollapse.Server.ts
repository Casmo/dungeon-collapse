/// <reference path="references.ts"/>
var WebSocketServer = require("websocket").server;
var http = require("http");

module DungeonCollapse {

    export class Server {

        Chat: DungeonCollapse.Chat;

        settings: Settings;

        /**
         * Array with all connected clients. Each client has the following objects:
         * CLIENT_ID Int the id of itself and the key of the client array. @see numberOfClients
         * CLIENT_OPPONENT_ID Int the id of the opponent (default 0)
         * connection Object the websocket connection
         */
        clients:Array<any>;

        /**
         * Array with games
         */
        games:Array<any>;

        /**
         * Starts the server and start listening for incoming connections
         */
        constructor() {
            this.clients = [];
            this.Chat = new DungeonCollapse.Chat();
            this.settings = new Settings();
            var self = this;
            var server = http.createServer(function (request, response) {});
            server.listen(this.settings.port, function () {});

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
        addClient(request:any, CLIENT_ID:string): void {

            var self = this;

            var connection = request.accept(null, request.origin);
            var client = {
                connection: connection,
                name: 'Anonymous ('+ (this.clients.length+1) +')',
                connected: true
            };

            if (this.clients[CLIENT_ID] != null) {
                for (var attr in this.clients[CLIENT_ID]) {
                    client[attr] = client[attr];
                }
            }

            connection.on("message", function(message) {

                self.receiveMessage(message, CLIENT_ID);

            });

            connection.on("close", function(connection) {

                self.removeClient(CLIENT_ID);

            });

            this.clients[CLIENT_ID] = client;

        }

        /**
         * Removes the client from the game and send messages to opponent
         * @param CLIENT_ID
         */
        removeClient(CLIENT_ID:string): void {

            console.log('Client disconnected: ' + CLIENT_ID);
            this.clients[CLIENT_ID].connected = false;

        }

        /**
         * Receives and process a message from the server.
         * @param string message contains a JSON stringify object with at least a topic param
         * @param int CLIENT_ID the id of the client that sent the message
         */
        receiveMessage(message:any, CLIENT_ID:string): void {

            message = message.utf8Data;
            message = JSON.parse(message);
            switch (message.topic) {
                case 'chat':
                    this.Chat.chat(
                        CLIENT_ID,
                        this.clients[CLIENT_ID].CLIENT_OPPONENT_ID,
                        message.message
                    );
                    break;
            }

        }

        /**
         * Parse all cookies from a request
         * @param request
         */
        private parseCookie(request:any):any {

            var list = [],
                rc = request.cookie;

            rc && rc.split(';').forEach(function( cookie ) {
                var parts = cookie.split('=');
                list[parts.shift().trim()] = decodeURI(parts.join('='));
            });
            return list;

        }

    }

}