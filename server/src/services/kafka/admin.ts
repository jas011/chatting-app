import kafka from "./kafkaInit";

async function KafkaInit() {
  const admin = await kafka.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Adming Connection Success...");

  console.log("Creating Topic [messages]");

    await admin.createTopics({
      topics: [
        {
          topic: "GroupChat",
          numPartitions: 1,
        },
        {
          topic: "DMs",
          numPartitions: 1,
        },
      ],
    });
  console.log("Topic Created Success [GroupChat, DMs]!");
  console.log("Disconnecting Admin..");
  await admin.disconnect();
}

export default KafkaInit;
