import React from "react";
import { Form, Card } from "antd";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useMutation } from "@/hooks/useMutation";
import API_ROUTES from "@/commons/apis";
import TableSchemaForm from "@/components/feature/TableSchemaForm";
import ActionButton from "@/components/common/ActionButton";
import { useNotification } from "@/hooks/useNotification";

const CreateTable: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const [form] = Form.useForm();
  const router = useRouter();
  const notification = useNotification();

  const { mutate: createTable, isMutating } = useMutation({
    mutationFn: (values) => ({
      url: API_ROUTES.SCHEMA.LIST,
      method: "POST",
      data: JSON.stringify({
        ...values,
        ownerEmail: session?.user?.email,
      }),
    }),
    onSuccess: () => {
      notification.success("Table created successfully!");
      router.push("/tables");
    },
    onError: (error: Error) => {
      notification.error(error.message || "Error creating table");
    },
  });

  return (
    <Card title="Create New Table">
      <TableSchemaForm form={form} onFinish={createTable} />
      <ActionButton
        onHandle={form.submit}
        loading={isMutating}
        onCancel={() => form.resetFields()}
        cancelText="Reset"
      />
    </Card>
  );
};

export default CreateTable;
