import { consumers } from "stream";
import kafka from "./kafkaInit";

class Consumer {
    private consumer;
    constructor(topic: string) {
        this.consumer = kafka.consumer({ groupId: 'chat-group' });
        console.log("Connecting consumer to Kafka...");
        this.consumer.connect();
        console.log("Consumer connected to Kafka!");
        this.consumer.subscribe({ topic: topic, fromBeginning: true });
    }
    async MessageConsumer() {
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }:{topic:string, partition:number, message:{value:string}, heartbeat:string, pause:string}) => {
                console.log(
                    `'chat-group': [${topic}]: PART:${partition}:`,
                    message.value.toString()
                );
            },
        });
    }

}
const consumer = new Consumer("GroupChat");
consumer.MessageConsumer();
export default Consumer;