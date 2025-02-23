import { File } from "formidable";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

// Validation function
export const validateFile = (file: File) => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    );
  }

  return true;
};
