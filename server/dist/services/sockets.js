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
const ws_1 = __importDefault(require("ws"));
const ioredis_1 = __importDefault(require("ioredis"));
const admin_1 = __importDefault(require("./kafka/admin"));
const producer_1 = __importDefault(require("./kafka/producer"));
const redisOptions = {
    retryStrategy: (times) => Math.min(times * 50, 2000), // Exponential backoff
};
const publisher = new ioredis_1.default(redisOptions); //publisher connection
const subscriber = new ioredis_1.default(redisOptions); //suscribers connection
const dmSubscriber = new ioredis_1.default(redisOptions); //suscribers connection
const redisClient = new ioredis_1.default(redisOptions); // Used for storing active users
class Websocket_Server {
    constructor(server) {
        this.activeClients = new Map(); // In-memory map for fast lookups
        console.log("new Websocket Server initilaised");
        this.initialiser();
        this.io = new ws_1.default.Server({ server });
    }
    initialiser() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Initialising Kafka...");
            subscriber.psubscribe("chat:*");
            dmSubscriber.subscribe("DMs");
            yield (0, admin_1.default)(); //initialise kafka topics
            this.producer = new producer_1.default(); // kafka producer instance
        });
    }
    // Store user WebSocket connections in Redis
    storeUserConnection(chatroom, userID, client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redisClient.sadd(`chatroom:${chatroom}`, userID);
            this.activeClients.set(userID, client);
        });
    }
    DMkey(sender, recipient) {
        return [sender, recipient].sort().join(":");
    }
    // Remove user on disconnect
    removeUserConnection(chatroom, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redisClient.srem(`chatroom:${chatroom}`, userID);
            const remainingUsers = yield redisClient.scard(`chatroom:${chatroom}`);
            this.activeClients.delete(userID);
            // If no users left, unsubscribe and delete chatroom
            if (remainingUsers === 0) {
                yield redisClient.del(`chatroom:${chatroom}`);
                subscriber.unsubscribe(`chat:${chatroom}`);
            }
        });
    }
    initListner() {
        this.io.on("connection", (client, req) => __awaiter(this, void 0, void 0, function* () {
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
                    yield this.storeUserConnection(chatroom, userID, client);
                    if (!subscriber.listenerCount(`chat:${chatroom}`)) {
                        subscriber.subscribe(`chat:${chatroom}`);
                    }
                }
                // Handle Disconnect
                client.on("close", () => __awaiter(this, void 0, void 0, function* () {
                    for (const chatroom of chatrooms) {
                        yield this.removeUserConnection(chatroom, userID);
                    }
                }));
            }
            // Message Handler
            client.on("message", (msg) => __awaiter(this, void 0, void 0, function* () {
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
                    yield publisher.publish(`chat:${roomid}`, formattedMessage);
                    // Store recent messages in Redis Stream (XADD)
                    yield redisClient.xadd(`chat_history:${roomid}`, "*", "message", formattedMessage);
                    yield this.producer.SendMessage("GroupChat", formattedMessage);
                }
                if (recipient) {
                    // const recipientClient = this.activeClients.get(recipient);
                    // if (recipientClient?.readyState === webSocket.OPEN) {
                    yield publisher.publish("DMs", message);
                    yield redisClient.xadd(`DMs_history:${this.DMkey(sender, recipient)}`, "*", "message", message);
                    yield this.producer.SendMessage("DMs", message);
                    // }
                }
            }));
        }));
        dmSubscriber.on("message", (_, message) => __awaiter(this, void 0, void 0, function* () {
            const dm = JSON.parse(message);
            const { sender, recipient } = dm;
            const RecipientClient = this.activeClients.get(recipient);
            const SenderClient = this.activeClients.get(sender);
            if ((RecipientClient === null || RecipientClient === void 0 ? void 0 : RecipientClient.readyState) === ws_1.default.OPEN) {
                RecipientClient.send(JSON.stringify(dm));
            }
            if ((SenderClient === null || SenderClient === void 0 ? void 0 : SenderClient.readyState) === ws_1.default.OPEN) {
                SenderClient.send(JSON.stringify(dm));
            }
        }));
        subscriber.on("message", (channel, message) => __awaiter(this, void 0, void 0, function* () {
            const chatroom = channel.split(":")[1];
            const users = yield redisClient.smembers(`chatroom:${chatroom}`); //returns all active members in chatroom
            users.forEach((userID) => {
                const client = this.activeClients.get(userID); // O(1) lookup
                if (client && client.readyState === ws_1.default.OPEN) {
                    client.send(message);
                }
            });
        }));
    }
    //old Message Handler
    handleMessage(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recipient, roomid, sender, limit } = JSON.parse(message);
            // Fetch older messages using Redis Streams XREVRANGE
            if (recipient) {
                const chatHistory = yield redisClient.xrevrange(`DMs_history:${this.DMkey(sender, recipient)}`, "+", "-", "COUNT", limit);
                console.log(chatHistory);
                client.send(JSON.stringify(chatHistory));
            }
            if (roomid) {
                const chatHistory = yield redisClient.xrevrange(`chat_history:${roomid}`, "+", "-", "COUNT", limit);
                console.log(chatHistory);
                client.send(JSON.stringify(chatHistory));
            }
        });
    }
}
module.exports = Websocket_Server;
