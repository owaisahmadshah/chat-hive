export function generateOTP() {
  let digits = '0123456789';
  let OTP = '';
  let len = digits.length;

  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }

  return OTP;
}

export const generateExpiryTime = (minutes: number = 5) => {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60 * 1000);
};
