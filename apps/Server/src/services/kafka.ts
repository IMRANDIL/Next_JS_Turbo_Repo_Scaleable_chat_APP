import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  brokers: ['']  
});


let producer: null | Producer = null;
export const createProducer = async() =>{
    if(producer) return producer;
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer
    return producer;
}

export default kafka;