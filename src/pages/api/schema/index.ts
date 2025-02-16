/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Table from "@/models/Table";

/**
 * API Endpoint: /api/tables
 *
 * GET  - Retrieve tables by owner (using query parameter: userId)
 * POST - Create a new table
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    switch (req.method) {
      // GET /api/tables?userId=...
      case "GET": {
        const { userId } = req.query;
        if (!userId || typeof userId !== "string") {
          console.error("Missing or invalid userId query parameter");
          return res.status(400).json({ message: "User id is required" });
        }

        const tables = await Table.find({ owner: userId, _deleted: false });
        console.info(`Fetched ${tables.length} tables for user ${userId}`);
        return res.status(200).json({ success: true, data: tables });
      }

      // POST /api/tables
      case "POST": {
        const { tableName, fields, userId } = req.body;
        if (!tableName || !fields || !userId) {
          console.error("Missing required fields in request body");
          return res.status(400).json({
            message: "Missing required fields: tableName, fields, and userId",
          });
        }

        const table = await Table.create({
          tableName,
          fields,
          owner: userId,
        });
        console.info(`Table created with id ${table._id}`);
        return res.status(201).json({ success: true, data: table });
      }

      // Handle unsupported methods
      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ message: "Method not allowed." });
      }
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}
