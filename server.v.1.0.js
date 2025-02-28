// const webSocket = require("ws");
// const Redis = require("ioredis");

// const redisOptions = {
//     retryStrategy: (times) => Math.min(times * 50, 2000) // Exponential backoff
// };

// const publisher = new Redis(redisOptions);//publisher connection
// const subscriber = new Redis(redisOptions);//suscribers connection
// const dmSubscriber = new Redis(redisOptions);//suscribers connection
// const redisClient = new Redis(redisOptions); // Used for storing active users


// // created a express server
// const app = express();
// app.use(express.json());
// const server = http.createServer(app);

// //created a websocket server
// const io = new webSocket.Server({ server });

// const activeClients = new Map(); // In-memory map for fast lookups

// // Handles active chatrooms
// app.get("/", (req, res) => {
//     res.send("WebSocket Server is Running!");
// });

// // Store user WebSocket connections in Redis
// const storeUserConnection = async (chatroom, userID, client) => {
//     await redisClient.sadd(`chatroom:${chatroom}`, userID);
//     activeClients.set(userID, client);
// };

// // Remove user on disconnect
// const removeUserConnection = async (chatroom, userID) => {
//     await redisClient.srem(`chatroom:${chatroom}`, userID);
//     const remainingUsers = await redisClient.scard(`chatroom:${chatroom}`);
//     activeClients.delete(userID);
//     // If no users left, unsubscribe and delete chatroom
//     if (remainingUsers === 0) {
//         await redisClient.del(`chatroom:${chatroom}`);
//         subscriber.unsubscribe(`chat:${chatroom}`);
//     }
// };

// // Redis Subscriber for Pub/Sub
// subscriber.psubscribe("chat:*");
// dmSubscriber.subscribe("DMs");

// dmSubscriber.on("message", async (_, message) => {
//     const dm = JSON.parse(message);
//     const { sender,recipient } = dm;
//     const RecipientClient = activeClients.get(recipient);
//     const SenderClient = activeClients.get(sender);


//     if (RecipientClient?.readyState === webSocket.OPEN) {
//         RecipientClient.send(JSON.stringify(dm));
//     }
//     if (SenderClient?.readyState === webSocket.OPEN) {
//         SenderClient.send(JSON.stringify(dm));
//     }

// });


// subscriber.on("message", async (channel, message) => {
//     const chatroom = channel.split(":")[1];
//     const users = await redisClient.smembers(`chatroom:${chatroom}`);//returns all active members in chatroom

//     users.forEach(userID => {
//         const client = activeClients.get(userID); // O(1) lookup
//         if (client && client.readyState === webSocket.OPEN) {
//             client.send(message);
//         }
//     });
// });




// io.on("connection", async (client, req) => {
//     // Extract user ID and chatroom from the request
//     const urlParams = new URLSearchParams(req.url.split("?")[1]);
//     const chatrooms = JSON.parse(urlParams.get("room"));
//     const userID = urlParams.get("user"); // Unique user identifier

//     // Join multiple chatrooms
//     for (const chatroom of chatrooms) {
//         await storeUserConnection(chatroom, userID, client);
//         if (!subscriber.listenerCount(`chat:${chatroom}`)) {
//             subscriber.subscribe(`chat:${chatroom}`);
//         }
        
//     }

//     // Message Handler
//     client.on("message", async (msg) => {
//         const message = msg.toString();
//         const { recipient,roomid, sender, chat } = JSON.parse(message);
//         if (roomid) {
//             const formattedMessage = JSON.stringify({ sender, chat, timestamp: Date.now() });

//             // Publish message to Redis Pub/Sub
//             await publisher.publish(`chat:${roomid}`, formattedMessage);

//             // Store recent messages in Redis Stream (XADD)
//             await redisClient.xadd(`chat_history:${roomid}`, "*", "message", formattedMessage);
//         }
//         if (recipient) {
//             const recipientClient = activeClients.get(recipient);
//             // if (recipientClient?.readyState === webSocket.OPEN) {
//                 await publisher.publish("DMs", message);
//                 await redisClient.xadd(`DMs_history:${[sender, recipient].sort().join(":")}`, "*", "message", message);
//             // }
//         }
        
//     });

//     // Handle Disconnect
//     client.on("close", async () => {
//         for (const chatroom of chatrooms) {
//             await removeUserConnection(chatroom, userID);
//         }
//     });
// });