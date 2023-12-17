import { Server } from "socket.io";
import { Redis } from "ioredis";



const pub = new Redis({
    host:'redis-21230caa-aliimranadil2-cf20.a.aivencloud.com',
    port: 18547,
    username: 'default',
    password: 'AVNS_srw9EgZaxr3myDRf6BS'
});

const sub = new Redis({
    host:'redis-21230caa-aliimranadil2-cf20.a.aivencloud.com',
    port: 18547,
    username: 'default',
    password: 'AVNS_srw9EgZaxr3myDRf6BS'
})



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

        sub.subscribe('MESSAGES')
    }

    public initListeners() {
        const io = this.io;
        console.log('initialised socket listeners...')
        io.on('connect', (socket)=>{
            console.log(`New Socket connected, ${socket.id}`);
            
            socket.on('event:msg', async({msg}: {msg: string})=>{
                console.log(`message received, ${msg}`);
                //publish the msg to redis now
                await pub.publish('MESSAGES', JSON.stringify({msg}))
            })
        });

        sub.on('message', async(channel, msg)=>{
            if(channel === 'MESSAGES') {
                io.emit('message', {msg})
            }
        })
    }

    get io() {
        return this._io;
    }
}

export default SocketService;