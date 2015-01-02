DungeonCollapse.Chat = {

    /**
     * Sends a chat message to a client.
     * @param CLIENT_ID number the id of the sender
     * @param CLIENT_ID number the id of the receiver. If empty sends to all
     * @param message string the message to send.
     */
    chat: function (FROM_CLIENT_ID, message, CLIENT_ID) {

        if (message == '') {
            return false;
        }
        if (CLIENT_ID == null || CLIENT_ID == '') {
            for (var ID in DungeonCollapse.Server.clients) {
                this.chat(FROM_CLIENT_ID, message, ID);
            }
            return true;
        }
        if (message != '' && DungeonCollapse.Server.clients[CLIENT_ID] != null && DungeonCollapse.Server.clients[CLIENT_ID].connected == true) {
            console.log('Chat message: '+ message);
            var dataJson = {
                topic: 'chat',
                message: message,
                name: DungeonCollapse.Server.clients[FROM_CLIENT_ID].name
            };
            if (DungeonCollapse.Server.clients[CLIENT_ID].connection.send(JSON.stringify(dataJson))) {
                return true;
            }
        }
        return false;

    }

};