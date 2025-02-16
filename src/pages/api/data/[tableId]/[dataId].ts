import dbConnect from "@/lib/dbConnect";
import Data from "@/models/Data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { tableId, dataId } = req.query;

  if (typeof tableId !== "string" || typeof dataId !== "string") {
    return res.status(400).json({ message: "Invalid tableId or dataId" });
  }

  // GET: Lấy chi tiết 1 bản ghi
  if (req.method === "GET") {
    try {
      const record = await Data.findOne({
        _id: dataId,
        tableId,
        _deleted: false,
      });
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }
      return res.status(200).json({ success: true, data: record });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server error", error });
    }
  }

  // PUT: Cập nhật bản ghi
  if (req.method === "PUT") {
    try {
      const updated = await Data.findOneAndUpdate(
        { _id: dataId, tableId },
        req.body,
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ message: "Record not found" });
      }
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server error", error });
    }
  }

  // DELETE: Xóa mềm bản ghi (update _deleted: true)
  if (req.method === "DELETE") {
    try {
      const deleted = await Data.findOneAndUpdate(
        { _id: dataId, tableId },
        { _deleted: true }
      );
      if (!deleted) {
        return res.status(404).json({ message: "Record not found" });
      }
      return res.status(200).json({ success: true, data: deleted });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server error", error });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
