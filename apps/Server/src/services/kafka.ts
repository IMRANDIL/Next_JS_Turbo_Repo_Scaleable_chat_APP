import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import prismaClient from "./prisma";
const kafka = new Kafka({
  brokers: ["kafka-25ee24c1-aliimranadil2-cf20.a.aivencloud.com:18560"],
  ssl: {
    ca: [fs.readFileSync(path.resolve("ca.pem"), "utf-8")],
  },
  sasl: {
    username: "avnadmin",
    password: "",
    mechanism: "plain",
  },
});

let producer: null | Producer = null;
export const createProducer = async () => {
  if (producer) return producer;
  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
};

export const produceMessage = async (message: string) => {
  const producer = await createProducer();
  await producer.send({
    messages: [
      {
        key: `message-${Date.now()}`,
        value: message,
      },
    ],
    topic: "MESSAGES",
  });
  return true;
};

export const startConsuming = async () => {
    console.log('consumer is running....')
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log("New msg recd in each message method");
      try {
        await prismaClient.message.create({
          data: {
            text: message.value?.toString(),
          },
        });
      } catch (error) {
        console.log("Some error occurred saving in db", error);
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
};

export default kafka;
