export type TShowType = "contacts" | "public" | "private";

export type TBaseUser = {
  email: string;
  username: string;
  imageUrl: string;
  about: string;
  showAbout: TShowType;
  showLastSeen: TShowType;
  showProfileImage: TShowType;
  isReadReceipts: boolean;
  password: string;
};

export type TCreateUser = TBaseUser & {
  isSignedIn: boolean;
  otp: string;
  otpExpiry: Date;
  refreshToken: string;
  isVerified: boolean;
};

export type TUserWithId = Omit<TBaseUser, "password"> & {
  userId: string;
};
