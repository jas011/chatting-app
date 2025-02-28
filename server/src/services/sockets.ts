import webSocket from "ws";
import Redis from "ioredis";
import KafkaInit from "./kafka/admin";
import Producer from "./kafka/producer";

const redisOptions = {
  retryStrategy: (times: number) => Math.min(times * 50, 2000), // Exponential backoff
};

const publisher = new Redis(redisOptions); //publisher connection
const subscriber = new Redis(redisOptions); //suscribers connection
const dmSubscriber = new Redis(redisOptions); //suscribers connection
const redisClient = new Redis(redisOptions); // Used for storing active users

class Websocket_Server {
  private activeClients = new Map(); // In-memory map for fast lookups
  private io;
  private producer: any; // kafka producer instance
  constructor(server: any) {
    console.log("new Websocket Server initilaised");
    this.initialiser();
    this.io = new webSocket.Server({ server });
  }
  async initialiser() {
    console.log("Initialising Kafka...");
    subscriber.psubscribe("chat:*");
    dmSubscriber.subscribe("DMs");
    await KafkaInit(); //initialise kafka topics
    this.producer = new Producer(); // kafka producer instance
  }
  // Store user WebSocket connections in Redis
  async storeUserConnection(chatroom: string, userID: string, client: Object) {
    await redisClient.sadd(`chatroom:${chatroom}`, userID);
    this.activeClients.set(userID, client);
  }

  DMkey(sender: string, recipient: string) {
    return [sender, recipient].sort().join(":");
  }

  // Remove user on disconnect
  async removeUserConnection(chatroom: string, userID: string) {
    await redisClient.srem(`chatroom:${chatroom}`, userID);
    const remainingUsers = await redisClient.scard(`chatroom:${chatroom}`);
    this.activeClients.delete(userID);
    // If no users left, unsubscribe and delete chatroom
    if (remainingUsers === 0) {
      await redisClient.del(`chatroom:${chatroom}`);
      subscriber.unsubscribe(`chat:${chatroom}`);
    }
  }
  public initListner() {
    this.io.on("connection", async (client: any, req: any) => {
      // Extract user ID and chatroom from the request
      const urlParams = req.url
        ? new URLSearchParams(req.url.split("?")[1])
        : null;
      if (!urlParams) {
        client.close();
        return;
      }
      const chatrooms = JSON.parse(urlParams.get("room") || "[]");
      const userID = urlParams.get("user"); // Unique user identifier

      if (userID) {
        // Join multiple chatrooms
        for (const chatroom of chatrooms) {
          await this.storeUserConnection(chatroom, userID, client);
          if (!subscriber.listenerCount(`chat:${chatroom}`)) {
            subscriber.subscribe(`chat:${chatroom}`);
          }
        }

        // Handle Disconnect
        client.on("close", async () => {
          for (const chatroom of chatrooms) {
            await this.removeUserConnection(chatroom, userID);
          }
        });
      }

      // Message Handler
      client.on("message", async (msg: Buffer | string) => {
        const message = msg.toString();
        const { recipient, roomid, sender, chat, type } = JSON.parse(message);
        if (type) {
          switch (type) {
            case "fetch_old_messages":
              this.handleMessage(client, message);
              break;
          }
          return;
        }
        if (roomid) {
          const formattedMessage = JSON.stringify({
            sender,
            chat,
            timestamp: Date.now(),
          });

          // Publish message to Redis Pub/Sub
          await publisher.publish(`chat:${roomid}`, formattedMessage);

          // Store recent messages in Redis Stream (XADD)
          await redisClient.xadd(
            `chat_history:${roomid}`,
            "*",
            "message",
            formattedMessage
          );
          await this.producer.SendMessage("GroupChat", formattedMessage);
        }
        if (recipient) {
          // const recipientClient = this.activeClients.get(recipient);
          // if (recipientClient?.readyState === webSocket.OPEN) {
          await publisher.publish("DMs", message);
          await redisClient.xadd(
            `DMs_history:${this.DMkey(sender, recipient)}`,
            "*",
            "message",
            message
          );
          await this.producer.SendMessage("DMs", message);
          // }
        }
      });
    });

    dmSubscriber.on("message", async (_: string, message: string) => {
      const dm = JSON.parse(message);
      const { sender, recipient } = dm;
      const RecipientClient = this.activeClients.get(recipient);
      const SenderClient = this.activeClients.get(sender);

      if (RecipientClient?.readyState === webSocket.OPEN) {
        RecipientClient.send(JSON.stringify(dm));
      }
      if (SenderClient?.readyState === webSocket.OPEN) {
        SenderClient.send(JSON.stringify(dm));
      }
    });
    subscriber.on("message", async (channel: string, message: string) => {
      const chatroom = channel.split(":")[1];
      const users = await redisClient.smembers(`chatroom:${chatroom}`); //returns all active members in chatroom

      users.forEach((userID: string) => {
        const client = this.activeClients.get(userID); // O(1) lookup
        if (client && client.readyState === webSocket.OPEN) {
          client.send(message);
        }
      });
    });
  }

  //old Message Handler
  async handleMessage(client: webSocket.WebSocket, message: string) {
    const { recipient, roomid, sender, limit } = JSON.parse(message);
    // Fetch older messages using Redis Streams XREVRANGE
    if (recipient) {
      const chatHistory = await redisClient.xrevrange(
        `DMs_history:${this.DMkey(sender, recipient)}`,
        "+",
        "-",
        "COUNT",
        limit
      );
      console.log(chatHistory);
      client.send(JSON.stringify(chatHistory));
    }

    if (roomid) {
      const chatHistory = await redisClient.xrevrange(
        `chat_history:${roomid}`,
        "+",
        "-",
        "COUNT",
        limit
      );
      console.log(chatHistory);
      client.send(JSON.stringify(chatHistory));
    }
  }
}

module.exports = Websocket_Server;
