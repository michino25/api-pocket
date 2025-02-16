/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosResponse } from "axios";

export const downloadFile = async (
  response: AxiosResponse<Blob>,
  fileName?: string
) => {
  if (response.status === 200) {
    try {
      // Get the file name from the "content-disposition" header
      const contentDisposition = response.headers["content-disposition"];
      const finalFileName =
        fileName || getFileName(contentDisposition) || "download";

      // Get the file type (MIME type)
      const contentType = response.headers["content-type"];

      // Create a Blob to download the file
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      // Create an <a> element to download the file
      const anchorElement = document.createElement("a");
      anchorElement.href = url;
      anchorElement.download = finalFileName;
      anchorElement.click();

      // Release memory
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      throw new Error("An error occurred while downloading the file.");
    }
  } else {
    throw new Error("File not found.");
  }
};

const getFileName = (contentDisposition?: string) => {
  if (!contentDisposition) return "";
  const match = contentDisposition.match(/filename="?([^";]+)"?/);
  return match ? match[1] : "";
};
