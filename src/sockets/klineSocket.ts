import { Server, Socket } from "socket.io";
import klineSocket from "./kline";

class KlineSocket {
    public io: any;
    private onlineCount: number = 0;
    constructor(io: Server) {
        this.io = io.of("/kline");
        this.connection();
    }

    connection() {
        this.io.on("connection", (socket: Socket) => {
            this.onlineCount++;
            console.log(`New client connected. Online: ${this.onlineCount}`);
            this.io.emit("onlineCount", this.onlineCount);
            klineSocket(this.io, socket);
            socket.on("disconnect", () => {
                this.onlineCount--;
                console.log(`Client disconnected. Online: ${this.onlineCount}`);
                this.io.emit("onlineCount", this.onlineCount);
            });
        });
    }
}

export default KlineSocket;
