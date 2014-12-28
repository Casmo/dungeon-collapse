/// <reference path="references.ts"/>

module DungeonCollapse {

    class Chat {

        /**
         * Sends a chat message to a client.
         * @parem int CLIENT_ID the id of the receiver
         * @param string message the message to send.
         */
        chat (CLIENT_ID:number, message:string):boolean {

            if (DungeonCollapse.Server.clients[CLIENT_ID] != null && message != '') {
                return DungeonCollapse.Server.clients[CLIENT_ID].connection.send(JSON.stringify({topic:'chat',message:message}));
            }
            return false;

        }

    }

}