// src/pages/admin/tables/create.tsx

import React from "react";
import { Form, Input, Button, Select, Checkbox, Card, message } from "antd";
import AdminLayout from "../../../components/AdminLayout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const { Option } = Select;

const CreateTable: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    const payload = { ...values, owner: session?.user?.email || "unknown" };

    try {
      const res = await fetch("/api/tables/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to create table");
      }
      message.success("Table created successfully!");
      router.push("/admin/tables");
    } catch (error: any) {
      message.error(error.message || "Error creating table");
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <Card title="Create New Table">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="tableName"
            label="Table Name"
            rules={[{ required: true, message: "Please enter table name" }]}
          >
            <Input placeholder="Table Name" />
          </Form.Item>
          <Form.List name="fields">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} style={{ marginBottom: 16 }}>
                    <Form.Item
                      {...restField}
                      name={[name, "fieldName"]}
                      label="Field Name"
                      rules={[{ required: true, message: "Enter field name" }]}
                    >
                      <Input placeholder="Field Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "fieldKey"]}
                      label="Field Key"
                      rules={[{ required: true, message: "Enter field key" }]}
                    >
                      <Input placeholder="Field Key" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "dataType"]}
                      label="Data Type"
                      rules={[{ required: true, message: "Select data type" }]}
                    >
                      <Select placeholder="Select data type">
                        <Option value="string">String</Option>
                        <Option value="number">Number</Option>
                        <Option value="boolean">Boolean</Option>
                        <Option value="date">Date</Option>
                        <Option value="object">Object</Option>
                        <Option value="array">Array</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "isPrimaryKey"]}
                      valuePropName="checked"
                      label="Primary Key"
                    >
                      <Checkbox />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)}>
                      Remove Field
                    </Button>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Table
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default CreateTable;
