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
exports.startConsuming = exports.produceMessage = exports.createProducer = void 0;
const kafkajs_1 = require("kafkajs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("./prisma"));
const kafka = new kafkajs_1.Kafka({
    brokers: ["kafka-25ee24c1-aliimranadil2-cf20.a.aivencloud.com:18560"],
    ssl: {
        ca: [fs_1.default.readFileSync(path_1.default.resolve("ca.pem"), "utf-8")],
    },
    sasl: {
        username: "avnadmin",
        password: "AVNS_A1TzVohhJtj2GlAxUzz",
        mechanism: "plain",
    },
});
let producer = null;
const createProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    if (producer)
        return producer;
    const _producer = kafka.producer();
    yield _producer.connect();
    producer = _producer;
    return producer;
});
exports.createProducer = createProducer;
const produceMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const producer = yield (0, exports.createProducer)();
    yield producer.send({
        messages: [
            {
                key: `message-${Date.now()}`,
                value: message,
            },
        ],
        topic: "MESSAGES",
    });
    return true;
});
exports.produceMessage = produceMessage;
const startConsuming = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('consumer is running....');
    const consumer = kafka.consumer({ groupId: "default" });
    yield consumer.connect();
    yield consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
    yield consumer.run({
        autoCommit: true,
        eachMessage: ({ message, pause }) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!message.value)
                return;
            console.log("New msg recd in each message method");
            try {
                yield prisma_1.default.message.create({
                    data: {
                        text: (_a = message.value) === null || _a === void 0 ? void 0 : _a.toString(),
                    },
                });
            }
            catch (error) {
                console.log("Some error occurred saving in db", error);
                pause();
                setTimeout(() => {
                    consumer.resume([{ topic: "MESSAGES" }]);
                }, 60 * 1000);
            }
        }),
    });
});
exports.startConsuming = startConsuming;
exports.default = kafka;
