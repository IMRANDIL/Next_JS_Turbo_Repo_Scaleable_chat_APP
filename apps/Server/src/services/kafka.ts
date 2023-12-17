import { Kafka, Producer } from "kafkajs";
import fs from 'fs';
import path from 'path'
const kafka = new Kafka({
  brokers: ['kafka-25ee24c1-aliimranadil2-cf20.a.aivencloud.com:18560'],
  ssl: {
    ca: [fs.readFileSync(path.resolve('ca.pem'), 'utf-8')]
  },
  sasl: {
    username: 'avnadmin',
    password: 'AVNS_A1TzVohhJtj2GlAxUzz',
    mechanism: 'plain',
  }
});


let producer: null | Producer = null;
export const createProducer = async() =>{
    if(producer) return producer;
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer
    return producer;
}

export const produceMessage = async(message: string) =>{
    const producer = await createProducer();
   await producer.send({
        messages: [{
            key: `message-${Date.now()}`,
            value: message
        }],
        topic: 'MESSAGES'
    });
    return true;
}

export default kafka;