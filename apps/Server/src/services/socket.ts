import { Server } from "socket.io";
import { Redis } from "ioredis";
import { produceMessage } from "./kafka";
import prismaClient from "./prisma";



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
        io.on('connect', async(socket)=>{
            console.log(`New Socket connected, ${socket.id}`);
            // Fetch previous messages from the database
      const previousMessages = await prismaClient.message.findMany();
      // Emit previous messages to the connected client
      socket.emit('previousMessages', previousMessages);
      
            socket.on('event:msg', async({msg}: {msg: string})=>{
                console.log(`message received, ${msg}`);
                //publish the msg to redis now
                await pub.publish('MESSAGES', JSON.stringify({msg}))
            })
        });

        sub.on('message', async(channel, msg)=>{
            if(channel === 'MESSAGES') {
                console.log('message from message channel>>>>', msg)
                io.emit('message', {msg});
                //kafka now...
                // produce the msg to kafak
                await produceMessage(msg);
                console.log('msg produced to kafka...')
            }
        })
    }

    get io() {
        return this._io;
    }
}

export default SocketService;