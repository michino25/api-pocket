import React, { useEffect, useState } from "react";
import { Form, Card, Alert } from "antd";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@/hooks";
import API_ROUTES from "@/commons/apis";
import TableSchemaForm from "@/components/feature/TableSchemaForm";
import ActionButton from "@/components/common/ActionButton";
import { useNotification } from "@/hooks/useNotification";
import { useSidebarTableStore } from "@/stores/useSidebarTableStore";
import { ITable } from "@/models/Table";

const Schema: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const [form] = Form.useForm();
  const notification = useNotification();
  const { tables, setTables } = useSidebarTableStore();
  const router = useRouter();
  const { tableIdPart1, tableIdPart2 } = router.query;
  const tableId = `${tableIdPart1 || ""}${tableIdPart2 || ""}`;
  const [formChange, setFormChange] = useState(false);

  const {
    data: tableSchema,
    isLoading: isSchemaLoading,
    refetch: refetchSchema,
  } = useQuery({
    url: API_ROUTES.SCHEMA.DETAIL(tableId),
    enabled: !!tableId,
    queryKey: [tableId],
  });

  const { data: tableData } = useQuery({
    url: API_ROUTES.DATA_TABLE.LIST(tableId),
    enabled: !!tableId,
    queryKey: [tableId],
  });
  const isTableHasData = tableData?.data.length > 0;

  const { mutate: updateTableSchema, isMutating: isUpdating } = useMutation({
    mutationFn: (values) => ({
      url: API_ROUTES.SCHEMA.DETAIL(tableId),
      method: "PUT",
      data: JSON.stringify({
        ...values,
        userId: session?.user?.id,
      }),
    }),
    onSuccess: (response) => {
      notification.success("Table schema edited successfully!");
      if (response.data.tableName !== tableSchema?.data.tableName) {
        updateTableNameInSidebar(response.data);
      }
      refetchSchema();
    },
    onError: (error: Error) => {
      notification.error(error.message || "Error editing table");
    },
  });

  const updateTableNameInSidebar = (updatedTable: ITable) => {
    setTables(
      tables!.map((table) =>
        table._id === updatedTable._id
          ? { ...table, tableName: updatedTable.tableName }
          : table
      )
    );
  };

  useEffect(() => {
    if (tableSchema) {
      form.resetFields();
    }
  }, [form, tableSchema]);

  return (
    <Card
      title={`Schema Management for Table: ${
        tableSchema?.data.tableName || ""
      }`}
      loading={isSchemaLoading}
    >
      {isTableHasData && (
        <Alert
          message="This table already has data, so the table schema cannot be edited anymore."
          type="warning"
          showIcon
          className="border-none mb-5"
        />
      )}
      <TableSchemaForm
        form={form}
        onFinish={(values) => {
          updateTableSchema(values);
          setFormChange(false);
        }}
        initialValues={tableSchema?.data}
        onValuesChange={() => !formChange && setFormChange(true)}
        disabled={isTableHasData}
      />
      <ActionButton
        onHandle={form.submit}
        loading={isUpdating}
        onCancel={() => {
          form.resetFields();
          setFormChange(false);
        }}
        cancelText="Reset"
        hidden={!formChange}
      />
    </Card>
  );
};

export default Schema;
