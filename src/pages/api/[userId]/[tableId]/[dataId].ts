/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Table from "@/models/Table";
import Data from "@/models/Data";
import { encryptApiKey } from "@/utils/encrypt";
import {
  checkPrimaryUnique,
  runMiddleware,
  validateDataFields,
} from "@/utils/api-validate";
import { CastError } from "mongoose";
import Cors from "cors";

const cors = Cors({
  origin: "*",
  methods: ["GET", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
});

/**
 * API Endpoint: /api/[userId]/[tableId]/[dataId]
 *
 * GET    - Retrieve details of a single data record.
 * PUT    - Update a record with a full update (all required fields must be provided).
 * PATCH  - Partially update a record (only update the provided fields).
 * DELETE - Soft delete a record by setting _deleted to true.
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  await dbConnect();

  // Get URL parameters
  const { userId, tableId, dataId } = req.query;
  if (
    typeof userId !== "string" ||
    typeof tableId !== "string" ||
    typeof dataId !== "string"
  ) {
    return res
      .status(400)
      .json({ message: "userId, tableId and dataId are required." });
  }

  // Validate x-api-key
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== encryptApiKey(tableId, userId, req.method!)) {
    return res.status(401).json({ message: "Unauthorized: Invalid API key." });
  }

  // Get table by tableId
  const table = await Table.findById(tableId);
  if (!table) {
    return res.status(404).json({ message: "Table not found." });
  }

  try {
    if (req.method === "GET") {
      // === GET detail ===
      const record = await Data.findOne(
        { _id: dataId, tableId: table._id.toString(), _deleted: false },
        "_id createdAt updatedAt data"
      );

      if (!record)
        return res.status(404).json({ message: "Record not found." });

      return res.status(200).json({
        success: true,
        data: {
          id: record._id,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          ...record.data,
        },
        message: "Record details retrieved successfully.",
      });
    } else if (req.method === "PUT" || req.method === "PATCH") {
      // === PUT: requires full update; PATCH: partial update (required fields not checked)
      const inputData = req.body;
      if (!inputData || typeof inputData !== "object") {
        return res
          .status(400)
          .json({ message: "Invalid data in request body." });
      }
      const checkRequired = req.method === "PUT";
      const {
        valid,
        errors,
        data: validatedData,
      } = validateDataFields(inputData, table.fields, checkRequired);
      if (!valid) {
        return res.status(400).json({ message: errors.join(" ") });
      }
      // Check unique constraints for primary fields (excluding the current record)
      const primaryErrors = await checkPrimaryUnique(
        table._id.toString(),
        table.fields,
        validatedData,
        dataId
      );
      if (primaryErrors.length > 0) {
        return res.status(400).json({ message: primaryErrors.join(" ") });
      }
      let updated;
      if (req.method === "PUT") {
        // Replace the entire data object of the record
        updated = await Data.findOneAndUpdate(
          { _id: dataId, tableId: table._id.toString() },
          { data: validatedData },
          { new: true }
        );
      }
      if (req.method === "PATCH") {
        // Create an update object for each field (using $set)
        const updateObj: Record<string, unknown> = {};
        for (const key in validatedData) {
          updateObj[`data.${key}`] = validatedData[key];
        }

        updated = await Data.findOneAndUpdate(
          { _id: dataId, tableId: table._id.toString() },
          { $set: updateObj },
          { new: true }
        );
      }

      if (!updated)
        return res.status(404).json({ message: "Record not found." });

      return res.status(200).json({
        success: true,
        data: {
          id: updated._id,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
          ...updated.data,
        },
        message: "Record updated successfully.",
      });
    } else if (req.method === "DELETE") {
      // === DELETE (soft delete) ===
      const deleted = await Data.findOneAndUpdate(
        { _id: dataId, tableId: table._id.toString() },
        { _deleted: true },
        { new: true }
      );
      if (!deleted) {
        return res.status(404).json({ message: "Record not found." });
      }
      return res.status(200).json({
        success: true,
        data: null,
        message: "Record deleted successfully.",
      });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (e: unknown) {
    const error = e as CastError;
    if (error?.path === "_id" && error?.kind === "ObjectId")
      return res.status(404).json({ message: "Record not found." });
    else {
      console.error("API Error:", error);
      return res.status(500).json({ message: "Server error.", error });
    }
  }
}
