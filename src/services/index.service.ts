import crypto from "crypto";
import bcrypt from "bcryptjs";
import redisClient from "../config/redis";

const OTP_EXPIRY_SECONDS = 5 * 60; 

export const generateOtpBySystem = async (mobile: string) => {
  if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
    throw new Error("Invalid mobile number");
  }

  const otp = crypto.randomInt(100000, 999999).toString()||'000000'; 
  const hashedOtp = await bcrypt.hash(otp, 10);
  const key = `otp:${mobile}`;

  await redisClient.setEx(key, OTP_EXPIRY_SECONDS, hashedOtp);

  console.log(`✅ OTP for ${mobile}: ${otp}`); 

  return {
    message: "OTP generated successfully",
    mobile,
    otpForDevOnly: otp, 
    expiresIn: OTP_EXPIRY_SECONDS,
  };
};