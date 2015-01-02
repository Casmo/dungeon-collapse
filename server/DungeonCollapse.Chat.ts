/// <reference path="references.ts"/>

module DungeonCollapse {

    export class Chat {

        Server: DungeonCollapse.Server;

        constructor() {
            this.Server = DungeonCollapse.Server;
        }
        /**
         * Sends a chat message to a client.
         * @param CLIENT_ID number the id of the sender
         * @param CLIENT_ID number the id of the receiver. If empty sends to all
         * @param message string the message to send.
         */
        chat (FROM_CLIENT_ID:string, message:string, CLIENT_ID:string):boolean {

            if (message == '') {
                return false;
            }
            if (CLIENT_ID == null || CLIENT_ID == '') {
                for (var ID in this.Server.clients) {
                    if (this.Server.clients[ID].connected == true) {
                        this.Server.clients[CLIENT_ID].connection.send(JSON.stringify(
                            {
                                topic:'chat',
                                message:message,
                                from:this.Server.clients[ID].name
                            }));
                    }
                }
                return true;
            }
            if (this.Server.clients[CLIENT_ID] != null && message != '') {
                if (this.Server.clients[CLIENT_ID].connection.send(JSON.stringify(
                        {
                            topic:'chat',
                            message:message,
                            from:this.Server.clients[FROM_CLIENT_ID].name
                        }))) {
                    return true;
                }
            }
            return false;

        }

    }

}