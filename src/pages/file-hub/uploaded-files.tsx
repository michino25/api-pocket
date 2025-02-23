import { useState } from "react";
import { Card, Modal, Upload, Spin } from "antd";
import { useQuery, useMutation, useNotification } from "@/hooks";
import type { ColumnsType } from "antd/es/table";
import { IFile } from "@/models/File";
import API_ROUTES from "@/commons/apis";
import { formatBytes } from "@/utils/number";
import { formatToTimeString } from "@/utils/date";
import CustomTable from "@/components/common/CustomTable";
import CustomButton from "@/components/common/CustomButton";
import { Upload as UploadIcon } from "lucide-react";
import { tooltipRenderer } from "@/utils/string";
import DeleteButton from "@/components/common/DeleteButton";

export default function UploadedFiles() {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const notification = useNotification();

  const {
    data: files,
    isLoading,
    refetch,
  } = useQuery({ url: API_ROUTES.FILE.GET_LIST });

  const { mutate: uploadFile, isMutating: isUploading } = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return {
        url: API_ROUTES.FILE.UPLOAD,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      };
    },
    onSuccess: (_, { originalFilename }) => {
      notification.success(`File ${originalFilename} uploaded successfully`);
      refetch();
    },
    onError: (error) => {
      notification.error(`Upload failed: ${error.message}`);
    },
  });

  const { mutate: deleteFile } = useMutation({
    mutationFn: (fileId: string) => ({
      url: API_ROUTES.FILE.DELETE(fileId),
      method: "DELETE",
    }),
    onSuccess: () => {
      notification.success("File deleted successfully");
      refetch();
    },
    onError: (error) => {
      notification.error(`Delete failed: ${error.message}`);
    },
  });

  const columns: ColumnsType<IFile> = [
    {
      title: "Name",
      dataIndex: "name",
      render: tooltipRenderer(),
    },
    {
      title: "Size",
      dataIndex: "size",
      render: formatBytes,
    },
    {
      title: "Uploaded",
      dataIndex: "createdAt",
      align: "center",
      render: formatToTimeString,
    },
    {
      title: "Preview",
      align: "center",
      render: (_, { driveFileId }) => (
        <CustomButton
          action="view"
          onClick={() => {
            setSelectedFileId(driveFileId);
          }}
        >
          Preview
        </CustomButton>
      ),
    },
    {
      title: "Download",
      align: "center",
      render: (_, { downloadUrl }) => (
        <CustomButton action="download" to={downloadUrl}>
          Download
        </CustomButton>
      ),
    },
    {
      title: "Delete",
      align: "center",
      render: (_, { _id, name }) => (
        <DeleteButton mutate={() => deleteFile(_id)} info={name} type="primary">
          Delete file
        </DeleteButton>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card title="File Upload">
        <Upload.Dragger
          showUploadList={false}
          customRequest={({ file }) => uploadFile(file)}
          multiple={false}
          disabled={isUploading}
        >
          <div className="my-4 flex justify-center items-center">
            {isUploading ? (
              <Spin />
            ) : (
              <UploadIcon size={24} className="text-primary" />
            )}
          </div>
          <p className="ant-upload-text text-sm">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">Support for single file upload.</p>
        </Upload.Dragger>
      </Card>

      <Card title="Uploaded Files">
        <CustomTable
          data={files?.data}
          unit="file"
          columns={columns}
          loading={isLoading}
        />
      </Card>

      <Modal
        title="File Preview"
        open={!!selectedFileId}
        onCancel={() => setSelectedFileId(null)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {selectedFileId && (
          <iframe
            src={`https://drive.google.com/file/d/${selectedFileId}/preview`}
            width="100%"
            height="480"
            className="border-none rounded-lg mt-3"
          />
        )}
      </Modal>
    </div>
  );
}
