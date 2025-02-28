const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    brokers: ['192.168.29.200:9092'],
    clientId: 'kafka-node-client',
});
export default kafka;


// docker run -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=192.168.29.200:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.29.200:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka