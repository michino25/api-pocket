import React from "react";
import { Form, Input, Button, Select, Checkbox, Card, message } from "antd";
import AdminLayout from "../../../components/AdminLayout";
import { useRouter } from "next/router";

const { Option } = Select;

const CreateTable: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    // Giả sử tạm thời owner được gán cố định (sau này tích hợp session)
    const payload = { ...values, owner: "testuser" };

    try {
      const res = await fetch("/api/tables/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Error creating table");
      }
      const data = await res.json();
      message.success("Bảng đã được tạo thành công!");
      router.push("/admin/tables");
    } catch (error) {
      message.error("Tạo bảng thất bại");
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <Card title="Tạo bảng mới">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="tableName"
            label="Tên bảng"
            rules={[{ required: true, message: "Vui lòng nhập tên bảng" }]}
          >
            <Input placeholder="Tên bảng" />
          </Form.Item>
          <Form.List name="fields">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} style={{ marginBottom: 16 }}>
                    <Form.Item
                      {...restField}
                      name={[name, "fieldName"]}
                      label="Tên Field"
                      rules={[{ required: true, message: "Nhập tên field" }]}
                    >
                      <Input placeholder="Tên Field" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "fieldKey"]}
                      label="Key Field"
                      rules={[{ required: true, message: "Nhập key field" }]}
                    >
                      <Input placeholder="Key Field" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "dataType"]}
                      label="Kiểu dữ liệu"
                      rules={[{ required: true, message: "Chọn kiểu dữ liệu" }]}
                    >
                      <Select placeholder="Chọn kiểu dữ liệu">
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
                      label="Khóa chính"
                    >
                      <Checkbox />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)}>
                      Xóa field
                    </Button>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Thêm field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo bảng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default CreateTable;
