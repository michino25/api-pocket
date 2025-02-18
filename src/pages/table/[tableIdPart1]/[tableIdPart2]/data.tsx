import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  DatePicker,
  Card,
  FormInstance,
  Space,
} from "antd";
import { useQuery } from "@/hooks/useQuery";
import { useMutation } from "@/hooks/useMutation";
import { IField } from "@/models/Table";
import CustomTable from "@/components/common/CustomTable";
import DeleteButton from "@/components/common/DeleteButton";
import CustomButton from "@/components/common/CustomButton";
import API_ROUTES from "@/commons/apis";
import ActionButton from "@/components/common/ActionButton";
import { datePickerFormItemHelper } from "@/utils/common";
import { formatToTimeString } from "@/utils/date";
import { useNotification } from "@/hooks";
import { ColumnsType } from "antd/es/table";
import { IResponse } from "@/commons/types";
import { IData } from "@/models/Data";
import validator from "@/utils/validate";
import { api } from "@/utils/axios";
import { downloadFile } from "@/utils/download-file";

const renderFormItem = (field: IField) => {
  switch (field.dataType) {
    case "string":
      return <Input placeholder={`Enter ${field.fieldName.toLowerCase()}`} />;
    case "number":
      return (
        <InputNumber
          className="w-full"
          placeholder={`Enter ${field.fieldName.toLowerCase()}`}
        />
      );
    case "boolean":
      return <Switch />;
    case "date":
      return (
        <DatePicker
          showTime
          className="w-full"
          placeholder={`Select ${field.fieldName.toLowerCase()}`}
          format="DD/MM/YYYY HH:mm:ss"
        />
      );
    default:
      return null;
  }
};

interface DataFormProps {
  onFinish: (values: IData) => void;
  fields: IField[];
  form: FormInstance;
}

const DataForm: React.FC<DataFormProps> = ({ onFinish, fields, form }) => (
  <Form form={form} layout="vertical" onFinish={onFinish}>
    {fields.map((field: IField) => (
      <Form.Item
        key={field.fieldKey}
        name={field.fieldKey}
        label={field.fieldName}
        rules={field.isRequired ? validator("required") : []}
        valuePropName={field.dataType === "boolean" ? "checked" : "value"}
        {...(field.dataType === "date" ? datePickerFormItemHelper : {})}
      >
        {renderFormItem(field)}
      </Form.Item>
    ))}
  </Form>
);

const TableDetail: React.FC = () => {
  const router = useRouter();
  const { tableIdPart1, tableIdPart2 } = router.query;
  const tableId = `${tableIdPart1 || ""}${tableIdPart2 || ""}`;
  const notification = useNotification();

  const { data: tableRes, isLoading: isTableLoading } = useQuery({
    url: API_ROUTES.SCHEMA.DETAIL(tableId),
    enabled: !!tableId,
    queryKey: [tableId],
  });
  const tableSchema = tableRes?.data;

  const {
    data: dataRecords,
    isLoading: isDataLoading,
    refetch,
  } = useQuery<IResponse<IData[]>>({
    url: API_ROUTES.DATA_TABLE.LIST(tableId),
    enabled: !!tableId,
    queryKey: [tableId],
  });

  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState<IData | null>(null);
  const [form] = Form.useForm();

  const openModal = useCallback(
    (record?: IData) => {
      if (record) {
        setEditingRecord(record);
        form.setFieldsValue(record.data);
      } else {
        setEditingRecord(null);
        form.resetFields();
      }
      setModalVisible(true);
    },
    [form]
  );

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  }, [form]);

  const mutationConfig = useCallback(
    (values: unknown) => {
      const payload = JSON.stringify(values);
      if (editingRecord) {
        return {
          method: "PUT",
          url: API_ROUTES.DATA_TABLE.DETAIL(
            tableId,
            (editingRecord as { _id: string })._id
          ),
          data: payload,
        };
      }
      return {
        method: "POST",
        url: API_ROUTES.DATA_TABLE.LIST(tableId),
        data: payload,
      };
    },
    [editingRecord, tableId]
  );

  const { mutate: submitData, isMutating: isSubmitting } = useMutation({
    mutationFn: mutationConfig,
    onSuccess: () => {
      notification.success(
        editingRecord
          ? "Data updated successfully"
          : "Data created successfully"
      );
      closeModal();
      refetch();
    },
    onError: (error) => {
      notification.error(`Error: ${error.message}`);
    },
  });

  const { mutate: deleteData, isMutating: isDeleting } = useMutation({
    mutationFn: ({ _id }: { _id: string }) => ({
      method: "DELETE",
      url: API_ROUTES.DATA_TABLE.DETAIL(tableId, _id),
    }),
    onSuccess: () => {
      notification.success("Data row deleted successfully");
      refetch();
    },
    onError: (error) => {
      notification.error(`Error: ${error.message}`);
    },
  });

  const columns: ColumnsType<IData> = useMemo(() => {
    if (!tableSchema) return [];
    return [
      ...tableSchema.fields.map((field: IField) => ({
        title: field.fieldName,
        key: field.fieldKey,
        render: (_: unknown, { data }: { data: Record<string, string> }) => {
          const value = data[field.fieldKey];
          switch (field.dataType) {
            case "boolean":
              return value ? "True" : "False";
            case "date":
              return formatToTimeString(value);
            default:
              return value;
          }
        },
      })),
      {
        title: "Actions",
        key: "actions",
        render: (_: unknown, record: IData) => (
          <div className="flex gap-2">
            <CustomButton action="edit" onClick={() => openModal(record)}>
              Edit
            </CustomButton>
            <DeleteButton
              info=""
              isPending={isDeleting}
              mutate={() => deleteData(record)}
              type="primary"
            >
              Delete
            </DeleteButton>
          </div>
        ),
      },
    ];
  }, [tableSchema, openModal, deleteData, isDeleting]);

  const downloadExcel = async () => {
    try {
      const response = await api.get(
        API_ROUTES.DATA_TABLE.EXPORT_EXCEL(tableId),
        {
          responseType: "blob",
        }
      );

      await downloadFile(response);
      notification.success("Data exported successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notification.error(error.message);
    }
  };

  return (
    <Card
      loading={isDataLoading || isTableLoading}
      title={`Data Management for Table: ${tableSchema?.tableName || ""}`}
      extra={
        <Space>
          <CustomButton onClick={() => downloadExcel()} action="download">
            Export Excel
          </CustomButton>
          <CustomButton type="primary" onClick={() => openModal()} action="add">
            Add Data
          </CustomButton>
        </Space>
      }
    >
      <CustomTable data={dataRecords?.data} unit="records" columns={columns} />

      {tableSchema && (
        <Modal
          title={editingRecord ? "Edit Data" : "Add Data"}
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
        >
          <DataForm
            onFinish={submitData}
            fields={tableSchema.fields}
            form={form}
          />
          <ActionButton
            onHandle={form.submit}
            loading={isSubmitting}
            cancelText="Reset"
            handleText={editingRecord ? "Update Data" : "Create Data"}
          />
        </Modal>
      )}
    </Card>
  );
};

export default TableDetail;
