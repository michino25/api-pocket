import dbConnect from "@/lib/dbConnect";
import Data from "@/models/Data";
import User from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { tableId } = req.query;

  if (typeof tableId !== "string") {
    return res.status(400).json({ message: "Invalid tableId" });
  }

  // Xử lý GET: Lấy danh sách dữ liệu của bảng
  if (req.method === "GET") {
    try {
      const data = await Data.find({ tableId, _deleted: false });
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server error", error });
    }
  }

  // Xử lý POST: Tạo dữ liệu mới cho bảng
  if (req.method === "POST") {
    const { userEmail, data } = req.body;
    if (!userEmail || !data) {
      return res
        .status(400)
        .json({ message: "Missing required fields: userEmail or data" });
    }
    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newData = await Data.create({ tableId, userId: user._id, data });
      return res.status(201).json({ success: true, data: newData });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server error", error });
    }
  }

  // Nếu method không được hỗ trợ
  return res.status(405).json({ message: "Method not allowed" });
}
