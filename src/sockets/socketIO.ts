import { Server } from "socket.io";
import parser from "socket.io-parser";
import KlineSocket from "./klineSocket";

class SocketIOController {
    public io: any;
    public optionsIO: Object = {
        parser,
        cors: {
            origin: true,
            pingTimeout: 30000,
            allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"],
            credentials: true,
        },
        transports: ["polling", "websocket"],
    };

    constructor(server: any) {
        this.io = new Server(server, this.optionsIO);

        new KlineSocket(this.io);

        console.log("Socket api is ready !!");
    }
}

export default SocketIOController;
