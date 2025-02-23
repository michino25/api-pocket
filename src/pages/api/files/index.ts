/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import File from "@/models/File";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import formidable from "formidable";
import { uploadFile } from "@/lib/googleDrive";
import { validateFile } from "@/utils/api-update-validate";

// Disable Next.js default body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * API Endpoint: /api/files
 *
 * GET  - Retrieve files by owner
 * POST - Upload a new file
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

  await dbConnect();

  try {
    switch (req.method) {
      // GET /api/files
      case "GET": {
        const files = await File.find({ uploadedBy: userId }).sort({
          createdAt: -1,
        });

        console.info(`Fetched ${files.length} files for user ${userId}`);
        return res.status(200).json({
          success: true,
          data: files,
        });
      }

      // POST /api/files
      case "POST": {
        const form = formidable({
          keepExtensions: true,
          multiples: false,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [fields, files] = await form.parse(req);

        if (!files.file) {
          console.error("No file provided in request");
          return res.status(400).json({
            success: false,
            message: "No file uploaded",
          });
        }

        const file = files.file[0];

        // Validate file
        try {
          validateFile(file);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message:
              error instanceof Error ? error.message : "File validation failed",
          });
        }

        const driveFile = await uploadFile(file);

        const newFile = await File.create({
          name: file.originalFilename,
          driveFileId: driveFile.id,
          mimeType: file.mimetype,
          size: file.size,
          uploadedBy: userId,
          serviceAccountEmail: driveFile.serviceAccountEmail,
          viewUrl: driveFile.webViewLink,
          downloadUrl: driveFile.webContentLink,
        });

        console.info(`File uploaded with id ${newFile._id}`);
        return res.status(201).json({
          success: true,
          data: newFile,
        });
      }

      // Handle unsupported methods
      default: {
        res.setHeader("Allow", ["GET", "POST"]);
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
