import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import Table from "../../../../models/Table";
import Data from "../../../../models/Data";

// Danh sách các username bị cấm (reserved)
const reservedUsernames = ["table", "tables", "api", "auth", "user-guide"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  // Lấy các tham số từ URL
  const { userEmail, tableId, action } = req.query;

  // Kiểm tra các tham số bắt buộc: username và tableName phải là string
  if (typeof userEmail !== "string" || typeof tableId !== "string") {
    return res.status(400).json({
      message: "User email and table id are required and must be strings.",
    });
  }

  // Kiểm tra user email: yêu cầu ít nhất 8 ký tự và không thuộc danh sách reserved
  if (
    userEmail.length < 8 ||
    reservedUsernames.includes(userEmail.toLowerCase())
  ) {
    return res.status(400).json({
      message:
        "Invalid username. Username must be at least 8 characters long and not use reserved names.",
    });
  }

  // Lấy recordId nếu có (action[0] sẽ là id nếu tồn tại; nếu action không có hoặc rỗng thì trả về null)
  const recordId =
    Array.isArray(action) && action.length > 0 ? action[0] : null;

  // Tìm bảng trong cơ sở dữ liệu dựa vào tableName và owner
  const table = await Table.findById(tableId);
  if (!table) {
    return res.status(404).json({ message: "Table not found." });
  }

  try {
    // Nếu không có recordId, xử lý thao tác trên danh sách dữ liệu của bảng
    if (!recordId) {
      if (req.method === "GET") {
        // Lấy danh sách dữ liệu cho bảng
        const data = await Data.find(
          {
            tableId: table._id.toString(),
            _deleted: false,
          },
          "_id createdAt updatedAt data"
        );

        const formattedData = data.map(
          ({ _id, createdAt, updatedAt, data }) => ({
            _id,
            createdAt,
            updatedAt,
            ...data,
          })
        );

        return res.status(200).json({ success: true, data: formattedData });
      }
      if (req.method === "POST") {
        // Tạo mới bản ghi dữ liệu
        const { userId, data } = req.body;
        if (!userId || !data) {
          return res
            .status(400)
            .json({ message: "Missing required fields: userId or data." });
        }
        const newRecord = await Data.create({
          tableId: table._id.toString(),
          userId,
          data,
        });
        return res.status(201).json({ success: true, data: newRecord });
      }
    }
    // Nếu có recordId, xử lý thao tác trên bản ghi cụ thể
    else {
      if (req.method === "GET") {
        const record = await Data.findOne({
          _id: recordId,
          tableId: table._id.toString(),
          _deleted: false,
        });
        if (!record) {
          return res.status(404).json({ message: "Record not found." });
        }
        return res.status(200).json({ success: true, data: record });
      }
      if (req.method === "PUT") {
        const updated = await Data.findOneAndUpdate(
          { _id: recordId, tableId: table._id.toString() },
          req.body,
          { new: true }
        );
        if (!updated) {
          return res.status(404).json({ message: "Record not found." });
        }
        return res.status(200).json({ success: true, data: updated });
      }
      if (req.method === "DELETE") {
        // Thực hiện xóa mềm bản ghi
        const deleted = await Data.findOneAndUpdate(
          { _id: recordId, tableId: table._id.toString() },
          { _deleted: true },
          { new: true }
        );
        if (!deleted) {
          return res.status(404).json({ message: "Record not found." });
        }
        return res.status(200).json({ success: true, data: deleted });
      }
    }

    // Nếu phương thức không được hỗ trợ
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Nested API Error:", error);
    return res.status(500).json({ message: "Server error.", error });
  }
}
