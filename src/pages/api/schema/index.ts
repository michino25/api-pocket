import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Table from "@/models/Table";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getTables(req, res);
    case "POST":
      return createTable(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

/**
 * GET /api/tables?owner=...
 * Lấy danh sách các bảng thuộc về owner
 */
const getTables = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ownerEmail } = req.query;

  if (!ownerEmail || typeof ownerEmail !== "string") {
    return res.status(400).json({ message: "Owner email is required" });
  }

  try {
    const user = await User.findOne({ email: ownerEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tables = await Table.find({ owner: user._id });
    return res.status(200).json({ success: true, data: tables });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

/**
 * POST /api/tables
 * Tạo một bảng mới
 */
const createTable = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tableName, fields, ownerEmail } = req.body;

  if (!tableName || !fields || !ownerEmail) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ email: ownerEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const table = await Table.create({
      tableName,
      fields,
      owner: user._id,
    });

    return res.status(201).json({ success: true, data: table });
  } catch (error) {
    console.error("Error creating table:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};
