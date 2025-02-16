/* eslint-disable no-console */
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, name } = req.body;

  try {
    await dbConnect();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.password) {
        return res.status(400).json({ message: "Email already registered" });
      } else {
        // Cập nhật mật khẩu và tên nếu cần
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        if (name) existingUser.name = name;
        await existingUser.save();
        return res.status(200).json({ message: "Password set successfully" });
      }
    } else {
      // Tạo user mới
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      return res.status(201).json({ message: "Registration successful" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
