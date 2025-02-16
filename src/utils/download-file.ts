/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosResponse } from "axios";

export const downloadFile = async (
  response: AxiosResponse<Blob>,
  fileName?: string
) => {
  if (response.status === 200) {
    try {
      // Lấy tên file từ header "content-disposition"
      const contentDisposition = response.headers["content-disposition"];
      const finalFileName =
        fileName || getFileName(contentDisposition) || "download";

      // Lấy loại file (MIME type)
      const contentType = response.headers["content-type"];

      // Tạo Blob để tải file
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> để tải file
      const anchorElement = document.createElement("a");
      anchorElement.href = url;
      anchorElement.download = finalFileName;
      anchorElement.click();

      // Giải phóng bộ nhớ
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
