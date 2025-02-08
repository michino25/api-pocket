import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    res.status(200).json({ message: "MongoDB connected successfully" });
  } catch (error) {
    res.status(500).json({ message: "MongoDB connection failed", error });
  }
}
