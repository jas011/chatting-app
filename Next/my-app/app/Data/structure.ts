type ChatMessage = {
  sender: string;
  recipient: string;
  chat: string;
  timestamps: Date;
  roomid: string;
};
export class Chats {
  private user: string;
  private UserChats = new Map();
  constructor(user: string) {
    this.user = user;
    this.UserChats.set(this.user, { DM: new Map(), groupchats: new Map() });
  }
  public messages(message: ChatMessage) {
    const { sender, recipient, timestamps, roomid } = message;
    //firstly creating for DMs
    const dateKey = new Date(timestamps).toLocaleDateString("en-CA"); // Extract YYYY-MM-DD
   
    if (recipient == this.user) {
      this.peerMessageHandler(sender, message, dateKey, timestamps);
    } else if (recipient && sender == this.user) {
      this.peerMessageHandler(recipient, message, dateKey, timestamps);
    }
    if (roomid) {
      this.groupMessaheHandler(roomid, message, dateKey, timestamps);
    }
  }
  private peerMessageHandler(
    peer: string,
    message: ChatMessage,
    dateKey: string,
    timestamps: Date
  ) {
    const user = this.UserChats.get(this.user); //geting user object
    if (!user.DM.has(peer)) {
      user.DM.set(peer, new Map()); //creating a map of sender
    }
    const participant = user.DM.get(peer); //peer(participant) is who we are talking with..
    if (!participant.has(dateKey)) {
      participant.set(dateKey, []);
    }
    const messageArray = participant.get(dateKey);
    if (messageArray.length == 0 || messageArray[0].timestamps > timestamps)
      messageArray.unshift(message);
    else messageArray.push(message);
  }

  private groupMessaheHandler(
    groupid: string,
    message: ChatMessage,
    dateKey: string,
    timestamps: Date
  ) {
    const user = this.UserChats.get(this.user);
    if (!user.groupchats.has(groupid)) {
      user.groupchats.set(groupid, new Map());
    }
    const group = user.groupchats.get(groupid);
    if (!group.has(dateKey)) {
      group.set(dateKey, []);
    }
    const participant = group.get(dateKey); //Sender(participant) is who is talking ..

    const messageArray = participant;
    if (messageArray.length == 0 || messageArray[0].timestamps > timestamps)
      messageArray.unshift(message);
    else messageArray.push(message);
  }
  getPeerMessages(peer:string){
    const user = this.UserChats.get(this.user);
    const participant = user.DM.get(peer);
    return participant;
  }
}

//for out of order messages if needed
/*
    //usage
    const messageArray = senderMessages.get(sender);
    this.insertMessageSorted(messageArray, message);
    
    
    //Implemetation 
     private insertMessageSorted(arr: ChatMessage[], message: ChatMessage) {
    if (arr.length === 0) {
      arr.push(message);
      return;
    }

    let left = 0,
      right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid].timestamps < message.timestamps) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    arr.splice(left, 0, message); // Insert message at the correct position
  }
}*/
