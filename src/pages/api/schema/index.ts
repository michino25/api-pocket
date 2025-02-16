/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Table from "@/models/Table";

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
 * GET /api/tables?userId=...
 * Lấy danh sách các bảng thuộc về owner
 */
const getTables = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "User id is required" });
  }

  try {
    const tables = await Table.find({ owner: userId, _deleted: false });
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
  const { tableName, fields, userId } = req.body;

  if (!tableName || !fields || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const table = await Table.create({
      tableName,
      fields,
      owner: userId,
    });

    return res.status(201).json({ success: true, data: table });
  } catch (error) {
    console.error("Error creating table:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};
