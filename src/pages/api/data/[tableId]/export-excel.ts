/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import ExcelJS from "exceljs";
import dbConnect from "@/lib/dbConnect";
import Table, { IField } from "@/models/Table";
import Data from "@/models/Data";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * API Endpoint: /api/data/:tableId/export-excel
 *
 * GET - Exports table data as an Excel file.
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
    console.error("Invalid or missing tableId.");
    return res.status(400).json({ message: "Invalid tableId" });
  }

  try {
    // Retrieve the table schema by tableId
    const table = await Table.findOne({
      _id: tableId,
      owner: userId,
      _deleted: false,
    });
    if (!table) {
      console.error(`Table ${tableId} not found.`);
      return res.status(404).json({ message: "Table not found" });
    }

    const fields = table.fields;
    // Retrieve all non-deleted records for the table
    const records = await Data.find({ tableId, _deleted: false });

    const fileName =
      (table.tableName || "Data") + "_" + dayjs().format("DDMMYYYY_HHmmss");

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);

    // Build header row using field names
    const headers = fields.map((field: IField) => field.fieldName);
    worksheet.addRow(headers);

    // Add data rows
    records?.forEach((record) => {
      const row = fields.map(
        (field: IField) => record.data[field.fieldKey] ?? ""
      );
      worksheet.addRow(row);
    });

    // Format header row: Bold font and centered alignment
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };

    // Set HTTP response headers to return an Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}.xlsx`
    );

    // Write the workbook to the response stream and end the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Excel Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}
