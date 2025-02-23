/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import File from "@/models/File";
import { deleteFile } from "@/lib/googleDrive";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * API Endpoint: /api/files/[id]
 *
 * DELETE - Delete a specific file
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate user session
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token.",
    });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid file ID provided.",
    });
  }

  await dbConnect();

  try {
    switch (req.method) {
      // DELETE /api/files/[id]
      case "DELETE": {
        // Check if file exists and belongs to user
        const file = await File.findOne({
          _id: id,
          uploadedBy: userId,
        });

        if (!file) {
          console.error(`File not found or unauthorized access: ${id}`);
          return res.status(404).json({
            success: false,
            message: "File not found.",
          });
        }

        // Delete from Google Drive
        await deleteFile(file.driveFileId, file.serviceAccountEmail);

        // Delete from database
        await File.findByIdAndDelete(id);

        console.info(`File deleted: ${id}`);
        return res.status(200).json({
          success: true,
          message: "File deleted successfully.",
        });
      }

      // Handle unsupported methods
      default: {
        res.setHeader("Allow", ["DELETE"]);
        return res.status(405).json({
          success: false,
          message: "Method not allowed.",
        });
      }
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
