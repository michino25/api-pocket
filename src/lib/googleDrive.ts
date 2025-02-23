/* eslint-disable no-console */
import { google } from "googleapis";
import fs from "fs";
import { parseJSON } from "@/utils/common";
import { File } from "formidable";

// ID of the folder shared with the service account
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";

const SERVICE_ACCOUNT_1 = process.env.GOOGLE_SERVICE_ACCOUNT_1 || "";
const SERVICE_ACCOUNT_2 = process.env.GOOGLE_SERVICE_ACCOUNT_2 || "";

// Parse and validate service accounts
const SERVICE_ACCOUNT_LIST = [SERVICE_ACCOUNT_1, SERVICE_ACCOUNT_2]
  .filter(Boolean)
  .map((acc) => {
    try {
      const parsed = parseJSON(acc);
      if (!parsed.private_key || !parsed.client_email) {
        throw new Error("Invalid service account format");
      }
      return parsed;
    } catch (error) {
      console.error("Error parsing service account:", error);
      return null;
    }
  })
  .filter(Boolean);

/**
 * Upload file to Google Drive and configure public access.
 * @param file - The file to upload, containing originalFilename, mimetype, and filepath.
 * @returns Promise returning the detailed information of the uploaded file.
 */
export async function uploadFile(file: File) {
  try {
    if (!file.originalFilename || !file.mimetype) {
      throw new Error("Invalid file: missing filename or mimetype");
    }

    if (SERVICE_ACCOUNT_LIST.length === 0) {
      throw new Error(
        "No valid service accounts found in environment variables"
      );
    }

    if (!FOLDER_ID) {
      throw new Error(
        "Google Drive folder ID not found in environment variables"
      );
    }

    // Select random service account
    const randomIndex = Math.floor(Math.random() * SERVICE_ACCOUNT_LIST.length);
    const selectedAuth = SERVICE_ACCOUNT_LIST[randomIndex];

    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials: selectedAuth,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    // Create drive client
    const drive = google.drive({ version: "v3", auth });

    // Upload file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.originalFilename,
        mimeType: file.mimetype,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.filepath),
      },
    });

    if (!response.data.id) {
      throw new Error("Failed to get file ID from upload response");
    }

    // Configure public access for the file
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Get file information
    const responseFile = await drive.files.get({
      fileId: response.data.id,
      fields: "id, name, webViewLink, webContentLink",
    });

    return {
      ...responseFile.data,
      serviceAccountEmail: selectedAuth.client_email,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Delete file from Google Drive.
 * @param fileId - The ID of the file to delete.
 * @param serviceAccountEmail - The email of the service account that created the file.
 * @returns Promise returning true if the file is successfully deleted.
 */
export async function deleteFile(fileId: string, serviceAccountEmail: string) {
  try {
    // Find the correct service account to delete
    const serviceAccount = SERVICE_ACCOUNT_LIST.find(
      (acc) => acc.client_email === serviceAccountEmail
    );
    if (!serviceAccount) {
      throw new Error(`Service account ${serviceAccountEmail} not found`);
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    await drive.files.delete({ fileId });
    return true;
  } catch (error) {
    console.error("Error deleting file from Drive:", error);
    throw error;
  }
}
