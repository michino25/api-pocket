import { notification } from "antd";
import { AxiosResponse } from "axios";

export const downloadFile = async (
  response: AxiosResponse<Blob>,
  defaultFileName?: string
) => {
  if (response.status === 200) {
    const contentDisposition = response.headers["content-disposition"];
    const fileName = defaultFileName || getFileName(contentDisposition) || "";
    const contentType = response.headers["content-type"];

    const blob = new Blob([response.data], { type: contentType });
    const url = URL.createObjectURL(blob);

    const anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = fileName;

    anchorElement.click();

    URL.revokeObjectURL(url);
  } else {
    void notification.error({
      message: "Tải file",
      description: "Không tìm thấy file",
    });
  }
};

const getFileName = (contentDisposition?: string) => {
  if (!contentDisposition) return "";
  const fileName = contentDisposition.split("filename=")?.[1].split(";")[0];
  return fileName || "";
};
