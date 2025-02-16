/* eslint-disable no-console */
import dbConnect from "@/lib/dbConnect";
import Data from "@/models/Data";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API Endpoint: /api/data/:tableId/:dataId
 *
 * GET    - Retrieve a single record by dataId for a given tableId
 * PUT    - Update a record (full update)
 * DELETE - Soft-delete a record (set _deleted: true)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { tableId, dataId } = req.query;
  if (typeof tableId !== "string" || typeof dataId !== "string") {
    console.error("Invalid or missing tableId or dataId");
    return res.status(400).json({ message: "Invalid tableId or dataId" });
  }

  try {
    switch (req.method) {
      // GET: Retrieve a single record by dataId
      case "GET": {
        const record = await Data.findOne({
          _id: dataId,
          tableId,
          _deleted: false,
        });
        if (!record) {
          console.error(`Record ${dataId} not found for table ${tableId}`);
          return res.status(404).json({ message: "Record not found" });
        }
        console.info(`Record ${dataId} retrieved successfully.`);
        return res.status(200).json({ success: true, data: record });
      }

      // PUT: Update a record (full update)
      case "PUT": {
        const updatedRecord = await Data.findOneAndUpdate(
          { _id: dataId, tableId },
          req.body,
          { new: true }
        );
        if (!updatedRecord) {
          console.error(`Record ${dataId} not found for table ${tableId}`);
          return res.status(404).json({ message: "Record not found" });
        }
        console.info(`Record ${dataId} updated successfully.`);
        return res.status(200).json({ success: true, data: updatedRecord });
      }

      // DELETE: Soft-delete a record by setting _deleted to true
      case "DELETE": {
        const deletedRecord = await Data.findOneAndUpdate(
          { _id: dataId, tableId },
          { _deleted: true },
          { new: true }
        );
        if (!deletedRecord) {
          console.error(`Record ${dataId} not found for table ${tableId}`);
          return res.status(404).json({ message: "Record not found" });
        }
        console.info(`Record ${dataId} soft-deleted successfully.`);
        return res.status(200).json({ success: true, data: deletedRecord });
      }

      // Handle unsupported methods
      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
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
