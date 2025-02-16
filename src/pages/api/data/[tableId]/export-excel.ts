/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import ExcelJS from "exceljs";
import dbConnect from "@/lib/dbConnect";
import Table, { IField } from "@/models/Table";
import Data from "@/models/Data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { tableId } = req.query;
  if (typeof tableId !== "string") {
    return res.status(400).json({ message: "Invalid tableId" });
  }

  try {
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    const fields = table.fields;

    const records = await Data.find({ tableId, _deleted: false });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(table.tableName || "Data");

    const headers = fields.map((field: IField) => field.fieldName);
    worksheet.addRow(headers);

    records.forEach((record) => {
      const row = fields.map(
        (field: IField) => record.data[field.fieldKey] || ""
      );
      worksheet.addRow(row);
    });

    // Định dạng tiêu đề (in đậm)
    const titleRow = worksheet.getRow(1);
    titleRow.font = { bold: true };
    titleRow.alignment = { horizontal: "center", vertical: "middle" };

    // Đặt header HTTP để trả về file Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${table.tableName}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Excel Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}
