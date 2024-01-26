"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ioredis_1 = require("ioredis");
const kafka_1 = require("./kafka");
const prisma_1 = __importDefault(require("./prisma"));
const pub = new ioredis_1.Redis({
    host: 'redis-21230caa-aliimranadil2-cf20.a.aivencloud.com',
    port: 18547,
    username: 'default',
    password: 'AVNS_srw9EgZaxr3myDRf6BS'
});
const sub = new ioredis_1.Redis({
    host: 'redis-21230caa-aliimranadil2-cf20.a.aivencloud.com',
    port: 18547,
    username: 'default',
    password: 'AVNS_srw9EgZaxr3myDRf6BS'
});
class SocketService {
    constructor() {
        console.log('Initiliasing socket server...');
        this._io = new socket_io_1.Server({
            cors: {
                origin: '*',
                allowedHeaders: '*'
            }
        });
        sub.subscribe('MESSAGES');
    }
    initListeners() {
        const io = this.io;
        console.log('initialised socket listeners...');
        io.on('connect', (socket) => __awaiter(this, void 0, void 0, function* () {
            console.log(`New Socket connected, ${socket.id}`);
            // Fetch previous messages from the database
            const previousMessages = yield prisma_1.default.message.findMany();
            // Emit previous messages to the connected client
            socket.emit('previousMessages', previousMessages);
            socket.on('event:msg', ({ msg }) => __awaiter(this, void 0, void 0, function* () {
                console.log(`message received, ${msg}`);
                //publish the msg to redis now
                yield pub.publish('MESSAGES', JSON.stringify({ msg }));
            }));
        }));
        sub.on('message', (channel, msg) => __awaiter(this, void 0, void 0, function* () {
            if (channel === 'MESSAGES') {
                console.log('message from message channel>>>>', msg);
                io.emit('message', { msg });
                //kafka now...
                // produce the msg to kafak
                yield (0, kafka_1.produceMessage)(msg);
                console.log('msg produced to kafka...');
            }
        }));
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
