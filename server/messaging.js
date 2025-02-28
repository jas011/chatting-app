// supposing we have a chat sent get from pub/sub to a chatroom having attributes recipient/chatroomId, sender, chat, timestamp
// we will get the chatroomid and using this we can send message to all the users plesent in chatroom;

async function sendMessage(channel, msg) {
    const message = JSON.parse(msg);
    const {recipient, chatroomId: roomId, sender, chat, timestamp} = message;
    const targetRoomId = recipient || roomId;
    const users = await redisClient.hgetall(`chatroom:${targetRoomId}`);
    users.forEach(user => {
        user.send(message);
    });
}
