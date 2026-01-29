export type TChat = {
  _id: string;
  user: {
    _id: string;
    username: string;
    imageUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastMessage: {
    message: string;
    photoUrl: string;
    status: "seen" | "sent" | "receive";
    chatId: string;
    sender: string;
  };
  unreadMessages: number;
};
