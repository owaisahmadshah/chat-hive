export type TBaseUser = {
  email: string;
  username: string;
  imageUrl: string;
  password: string;
};

export type TCreateUser = TBaseUser & {
  isSignedIn: boolean;
  otp: string;
  otpExpiry: Date;
  refreshToken: string;
  isVerified: boolean;
  googleId?: string | null;
  authProvider?: "local" | "google";
};

export type TUserWithId = Omit<TBaseUser, "password"> & {
  userId: string;
  isUserOnline?: boolean;
  isTyping?: boolean;
};

export type TUserReponse = {
  _id: string;
  email: string;
  username: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  isTyping?: string;
  isUserOnline?: boolean;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};
