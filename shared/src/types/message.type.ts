export interface ChatUser {
    _id: string;
    email: string;
    imageUrl: string;
    updatedAt: Date;
    isUserOnline?: boolean;
}

export interface Message {
    _id: string;
    sender: ChatUser;
    chatId: string;
    message: string;
    photoUrl: string;
    status: "sent" | "receive" | "seen";
    updatedAt: Date;
}

export interface newMessageType {
    chatId: string;
    message: Message;
    messageUsers: string[];
}

export interface handleSeenAndReceiveMessageType {
    receiver: string;
    chatId: string;
    messageId: string;
    status: "seen" | "receive";
}

export interface handleSeenAndReceiveMessagesType {
    receiver: string;
    chatId: string; // It is not always from the selected chat
    numberOfMessages: number;
    status: "seen" | "receive";
}

export interface typingType {
    chatId: string;
    userId: string;
    isTyping: boolean;
}
