/* eslint-disable no-console */
import dbConnect from "@/lib/dbConnect";
import Data from "@/models/Data";
import Table from "@/models/Table";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API Endpoint: /api/schema/:tableId
 *
 * GET    - Retrieve table details
 * PUT    - Update table (full update)
 * DELETE - Soft delete table and its related data
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tableId } = req.query;

  // Validate tableId
  if (!tableId || typeof tableId !== "string") {
    return res.status(400).json({
      success: false,
      message: "Missing or invalid tableId.",
    });
  }

  try {
    await dbConnect();

    switch (req.method) {
      // GET: Retrieve table details
      case "GET": {
        const table = await Table.findById(tableId);
        if (!table) {
          return res.status(404).json({
            success: false,
            message: "Table not found.",
          });
        }
        console.info(`Table ${tableId} retrieved successfully.`);
        return res.status(200).json({ success: true, data: table });
      }

      // PUT: Update table (full update)
      case "PUT": {
        const updateData = req.body;
        if (!updateData || Object.keys(updateData).length === 0) {
          return res.status(400).json({
            success: false,
            message: "Missing update data.",
          });
        }

        const updatedTable = await Table.findByIdAndUpdate(
          tableId,
          updateData,
          {
            new: true, // Return the updated document
          }
        );

        if (!updatedTable) {
          return res.status(404).json({
            success: false,
            message: "Table not found for update.",
          });
        }
        console.info(`Table ${tableId} updated successfully.`);
        return res.status(200).json({
          success: true,
          message: "Table updated successfully.",
          data: updatedTable,
        });
      }

      // DELETE: Soft delete table and related data
      case "DELETE": {
        const updatedTable = await Table.findByIdAndUpdate(tableId, {
          _deleted: true,
        });

        if (!updatedTable) {
          return res.status(404).json({
            success: false,
            message: "Table not found for deletion.",
          });
        }
        // Soft-delete all associated Data records
        await Data.updateMany({ tableId: tableId }, { _deleted: true });
        console.info(`Table ${tableId} and its related data soft-deleted.`);
        return res.status(200).json({
          success: true,
          message: "Table and related data have been successfully deleted.",
          data: null,
        });
      }

      // Handle unsupported HTTP methods
      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({
          success: false,
          message: "Method not allowed.",
        });
      }
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error,
    });
  }
};

export default handler;
