/// <reference path="DungeonCollapse.Server.ts"/>
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
                return DungeonCollapse.Server.clients[CLIENT_ID].connection.send(JSON.stringify({ topic: 'chat', message: message }));
            }
            return false;
        };
        return Chat;
    })();
})(DungeonCollapse || (DungeonCollapse = {}));
//# sourceMappingURL=DungeonCollapse.Chat.js.map
