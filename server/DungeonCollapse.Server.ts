/// <reference path="references.ts"/>
var settings:Settings;
var WebSocketServer = require("websocket").server;
var http = require("http");

module DungeonCollapse {

    export class Server {

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

            var self = this;
            this.settings = new Settings();
            this.cients = [];
            var server = http.createServer(function (request, response) {});
            server.listen(this.settings.port, function () {});

            var wsServer = new WebSocketServer({
                httpServer: server
            });
            wsServer.on("request", function (request) {
                self.addClient(request);
            });

        }

        /**
         * Adds a player to this.clients[].
         * @param object the Websocket request
         * @todo check with cookie if client already is in the list
         */
        addClient(request:any): void {

            var connection = request.accept(null, request.origin);
            var CLIENT_ID = this.clients.length;
            var client = {
                CLIENT_ID: CLIENT_ID,
                connection: connection
            };

            connection.on("message", function(message) {

                DungeonCollapse.Server.receiveMessage(message, CLIENT_ID);

            });

            connection.on("close", function(connection) {

                DungeonCollapse.Server.removeClient(CLIENT_ID);

            });

        }

        /**
         * Removes the client from the game and send messages to opponent
         * @param CLIENT_ID
         */
        removeClient(CLIENT_ID:number): void {

            this.clients[CLIENT_ID] = null;

        }

        /**
         * Receives and process a message from the server.
         * @param string message contains a JSON stringify object with at least a topic param
         * @param int CLIENT_ID the id of the client that sent the message
         */
        receiveMessage(message:any, CLIENT_ID:number): void {

            message = message.utf8Data;
            message = JSON.parse(message);
            switch (message.topic) {
                case 'chat':
                    DungeonCollapse.Chat.chat(
                        this.clients[CLIENT_ID].CLIENT_OPPONENT_ID,
                        message.message
                    );
                    break;
            }

        }

    }

}