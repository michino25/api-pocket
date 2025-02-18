/* eslint-disable no-console */
import dbConnect from "@/lib/dbConnect";
import Data from "@/models/Data";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * API Endpoint: /api/data/:tableId
 *
 * GET  - Retrieve the list of data records for a given table
 * POST - Create a new data record for a given table
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

  const { tableId } = req.query;
  if (typeof tableId !== "string") {
    console.error("Invalid or missing tableId");
    return res.status(400).json({ message: "Invalid tableId" });
  }

  try {
    switch (req.method) {
      // GET: Retrieve the list of data records for the specified table
      case "GET": {
        const records = await Data.find({
          tableId,
          userId,
          _deleted: false,
        });
        console.info(
          `Fetched ${records.length} data record(s) for table ${tableId}`
        );
        return res.status(200).json({ success: true, data: records });
      }

      // POST: Create a new data record for the specified table
      case "POST": {
        const newRecord = await Data.create({
          tableId,
          userId,
          data: req.body,
        });
        console.info(
          `Created new data record for table ${tableId} with id ${newRecord._id}`
        );
        return res.status(201).json({ success: true, data: newRecord });
      }

      // Unsupported methods
      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ message: "Method not allowed" });
      }
    }
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
}
