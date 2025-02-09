// src/pages/api/tables/list.ts

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Table from "@/models/Table";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const { owner } = req.query;
  if (!owner || typeof owner !== "string") {
    return res.status(400).json({ message: "Owner is required" });
  }

  try {
    const tables = await Table.find({ owner });
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
}
