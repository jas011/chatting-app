import kafka from "./kafkaInit";

class Producer {
    private producer;
    constructor() {
        console.log("Initializing Kafka producer...");
        this.producer = kafka.producer();
        this.initialize();
    }

    private async initialize() {
        try {
            console.log("Connecting producer to Kafka...");
            await this.producer.connect();
            console.log("Producer connected to Kafka!");
        } catch (error) {
            console.error("Error connecting to Kafka:", error);
        }
    }
    async SendMessage(topic: string, message: string) {
        console.log(`Sending message to ${topic}: ${message}`);
        try {
            await this.producer.send({
                topic: topic,
                messages: [{ key: "key", value: message }],
            });
            console.log(`Message sent to ${topic}`);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
}

export default Producer;
