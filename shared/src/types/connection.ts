export type TConnectionUser = {
  _id: string;
  username: string;
  imageUrl: string;
  lastSeen: string;
};

export type TConnection = {
  _id: string;
  sender: TConnectionUser;
  receiver: TConnectionUser;
  createdAt: Date;
  updatedAt: Date;
};
