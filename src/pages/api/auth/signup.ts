/* eslint-disable no-console */
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API Endpoint: /api/auth/register
 *
 * POST - Register a new user. If the user already exists without a password,
 *        this endpoint will set the password and update the name (if provided).
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password, name } = req.body;
    await dbConnect();

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If a password already exists, registration cannot proceed
      if (existingUser.password) {
        console.error(
          `Registration error: Email ${email} is already registered.`
        );
        return res.status(400).json({ message: "Email already registered" });
      } else {
        // Update user: set password and update name if provided
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        if (name) existingUser.name = name;
        await existingUser.save();
        console.info(
          `Password set successfully for existing user with email ${email}`
        );
        return res.status(200).json({ message: "Password set successfully" });
      }
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      console.info(`User registered successfully with email ${email}`);
      return res.status(201).json({ message: "Registration successful" });
    }
  } catch (error) {
    console.error("Server error during registration:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
