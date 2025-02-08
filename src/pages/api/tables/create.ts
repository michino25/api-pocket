// src/pages/api/tables/create.ts

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Table from "../../../models/Table";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { tableName, fields, owner } = req.body;
  if (!tableName || !fields || !owner) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const table = await Table.create({ tableName, fields, owner });
    return res.status(201).json({ success: true, data: table });
  } catch (error) {
    console.error("Error creating table:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
}
