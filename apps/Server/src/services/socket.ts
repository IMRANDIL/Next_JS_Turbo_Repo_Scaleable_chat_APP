import { Server } from "socket.io";

class SocketService {
    private _io:Server;
    constructor() {
        console.log('Initiliasing socket server...');
        this._io = new Server({
            cors: {
                origin: '*',
                allowedHeaders: '*'
            }
        });
    }

    public initListeners() {
        const io = this.io;
        console.log('initialised socket listeners...')
        io.on('connect', (socket)=>{
            console.log(`New Socket connected, ${socket.id}`);
            
            socket.on('event:msg', async({msg}: {msg: string})=>{
                console.log(`message received, ${msg}`)
            })
        })
    }

    get io() {
        return this._io;
    }
}

export default SocketService;