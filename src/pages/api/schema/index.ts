/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Table from "@/models/Table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * API Endpoint: /api/tables
 *
 * GET  - Retrieve tables by owner
 * POST - Create a new table
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate user
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token.",
    });
  }

  await dbConnect();

  try {
    switch (req.method) {
      case "GET": {
        const tables = await Table.find({
          owner: userId,
          _deleted: false,
        });
        console.info(
          `Fetched ${tables.length} tables for user ${session.user.id}`
        );
        return res.status(200).json({ success: true, data: tables });
      }

      // POST /api/tables
      case "POST": {
        const { tableName, fields } = req.body;
        if (!tableName || !fields) {
          console.error("Missing required fields in request body");
          return res.status(400).json({
            message: "Missing required fields: tableName, fields",
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
