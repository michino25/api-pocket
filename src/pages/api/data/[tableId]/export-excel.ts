import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import DynamicData from "../../../../models/DynamicData";
import ExcelJS from "exceljs";

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
    // Lấy dữ liệu của bảng (chỉ lấy các bản ghi chưa bị xóa mềm)
    const records = await DynamicData.find({ tableId, _deleted: false });

    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Giả sử dữ liệu được lưu trong trường 'data' dưới dạng object
    // Lấy danh sách các header từ key của bản ghi đầu tiên (nếu có)
    if (records.length > 0) {
      const headers = Object.keys(records[0].data);
      worksheet.addRow(headers);
      records.forEach((record) => {
        const row = headers.map((header) => record.data[header]);
        worksheet.addRow(row);
      });
    }

    // Đặt header để trả về file excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Excel Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}
