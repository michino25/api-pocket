import dbConnect from "@/lib/dbConnect";
import Table from "@/models/Table";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * GET /api/schema/:tableId - Lấy chi tiết bảng
 * PUT /api/schema/:tableId - Cập nhật bảng
 * DELETE /api/schema/:tableId - Xóa bảng
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tableId } = req.query;

  // Validate tableId
  if (!tableId || typeof tableId !== "string") {
    return res.status(400).json({
      success: false,
      message: "Thiếu tableId hoặc tableId không hợp lệ.",
    });
  }

  try {
    await dbConnect();

    switch (req.method) {
      // Xử lý GET request
      case "GET": {
        const table = await Table.findById(tableId);

        if (!table) {
          return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy bảng" });
        }

        return res.status(200).json({ success: true, data: table });
      }

      // Xử lý PUT request
      case "PUT": {
        const updateData = req.body;

        // Kiểm tra dữ liệu cập nhật
        if (!updateData || Object.keys(updateData).length === 0) {
          return res.status(400).json({
            success: false,
            message: "Thiếu dữ liệu cập nhật",
          });
        }

        const updatedTable = await Table.findByIdAndUpdate(
          tableId,
          updateData,
          { new: true } // Trả về document mới sau khi cập nhật
        );

        if (!updatedTable) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy bảng để cập nhật",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Cập nhật bảng thành công",
          data: updatedTable,
        });
      }

      // Xử lý DELETE request
      case "DELETE": {
        const deletedTable = await Table.findByIdAndDelete(tableId);

        if (!deletedTable) {
          return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy bảng để xóa" });
        }

        return res.status(200).json({
          success: true,
          message: "Bảng đã được xóa thành công",
          data: deletedTable,
        });
      }

      // Xử lý các method không được hỗ trợ
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ success: false, message: "Phương thức không được hỗ trợ" });
    }
  } catch (error) {
    console.error("Lỗi xử lý request:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ", error });
  }
};

export default handler;
