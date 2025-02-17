/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Table from "@/models/Table";
import Data from "@/models/Data";
import { encryptApiKey } from "@/utils/encrypt";
import {
  buildFilterQuery,
  checkPrimaryUnique,
  runMiddleware,
  validateDataFields,
  validateSort,
} from "@/utils/api-validate";
import Cors from "cors";

const cors = Cors({
  origin: "*",
  methods: ["GET", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
});

/**
 * API Endpoint: /api/[userId]/[tableId]
 *
 * GET  - Retrieve a list of data records for a given table.
 *        Supports pagination and filtering using query parameters.
 *
 * POST - Create a new data record for the specified table.
 *        Validates the input data and checks unique constraints for primary fields.
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  await dbConnect();

  // Get URL parameters
  const { userId, tableId } = req.query;
  if (typeof userId !== "string" || typeof tableId !== "string") {
    return res
      .status(400)
      .json({ message: "userId and tableId are required." });
  }

  // Validate x-api-key in header
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
      // === GET list ===
      // Supports pagination if limit is provided (with page defaulting to 1 if not provided)
      const { limit, page, sort, ...filters } = req.query;
      const {
        valid,
        errors,
        filter: filterQuery,
      } = buildFilterQuery(filters, table.fields);

      if (!valid) {
        return res.status(400).json({ message: errors.join(" ") });
      }

      const queryConditions = {
        tableId: table._id.toString(),
        _deleted: false,
        ...filterQuery,
      };

      const total = await Data.countDocuments(queryConditions);
      let dataQuery = Data.find(
        queryConditions,
        "_id createdAt updatedAt data"
      );

      if (sort) {
        const sortValidation = validateSort(sort, table.fields);
        if (!sortValidation.valid) {
          return res
            .status(400)
            .json({ message: sortValidation.errors.join(" ") });
        }
        if (Object.keys(sortValidation.sort).length > 0) {
          dataQuery = dataQuery.sort(sortValidation.sort);
        }
      }

      let currentPage = 1;

      if (limit !== undefined) {
        const limitNum = parseInt(limit as string, 10);
        if (isNaN(limitNum) || limitNum <= 0) {
          return res.status(400).json({ message: "Invalid limit value." });
        }
        if (page === undefined) {
          currentPage = 1;
        } else {
          currentPage = parseInt(page as string, 10);
          if (isNaN(currentPage) || currentPage <= 0) {
            return res.status(400).json({ message: "Invalid page value." });
          }
        }
        dataQuery = dataQuery
          .skip((currentPage - 1) * limitNum)
          .limit(limitNum);
      } else {
        if (page !== undefined) {
          return res
            .status(400)
            .json({ message: "Page parameter provided without limit." });
        }
      }

      const dataRecords = await dataQuery;
      const formattedData = dataRecords.map((record) => ({
        id: record._id,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        ...record.data,
      }));

      return res.status(200).json({
        success: true,
        data: formattedData,
        message: `Get ${table.tableName} list successfully`,
        page: currentPage,
        total,
      });
    } else if (req.method === "POST") {
      // === POST create new record ===
      const inputData = req.body;
      if (!inputData || typeof inputData !== "object") {
        return res
          .status(400)
          .json({ message: "Invalid data in request body." });
      }
      // Validate data (with checkRequired=true for POST)
      const {
        valid,
        errors,
        data: validatedData,
      } = validateDataFields(inputData, table.fields, true);
      if (!valid) {
        return res.status(400).json({ message: errors.join(" ") });
      }
      // Check uniqueness for primary fields
      const primaryErrors = await checkPrimaryUnique(
        table._id.toString(),
        table.fields,
        validatedData
      );
      if (primaryErrors.length > 0) {
        return res.status(400).json({ message: primaryErrors.join(" ") });
      }
      const newRecord = await Data.create({
        tableId: table._id.toString(),
        userId,
        data: validatedData,
      });
      return res.status(201).json({
        success: true,
        data: {
          id: newRecord._id,
          createdAt: newRecord.createdAt,
          updatedAt: newRecord.updatedAt,
          ...newRecord.data,
        },
        message: `Successfully created record in ${table.tableName}.`,
      });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Server error.", error });
  }
}
