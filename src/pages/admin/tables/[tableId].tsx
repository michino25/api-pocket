// src/pages/admin/tables/[tableId].tsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/AdminLayout";
import { Table, Button, Modal, Form, Input, message } from "antd";

interface IDataRecord {
  _id: string;
  data: any;
}

const TableDetail: React.FC = () => {
  const router = useRouter();
  const { tableId } = router.query;
  const [dataRecords, setDataRecords] = useState<IDataRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    if (!tableId || typeof tableId !== "string") return;
    setLoading(true);
    try {
      const res = await fetch(`/api/data/${tableId}`);
      const json = await res.json();
      if (json.success) {
        setDataRecords(json.data);
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableId]);

  const handleAdd = async (values: any) => {
    if (!tableId || typeof tableId !== "string") return;
    try {
      const res = await fetch(`/api/data/${tableId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "testuser", data: values }), // userId tạm thời
      });
      const json = await res.json();
      if (json.success) {
        message.success("Thêm dữ liệu thành công");
        setIsModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error("Thêm dữ liệu thất bại");
      }
    } catch (error) {
      message.error("Lỗi khi thêm dữ liệu");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (data: any) => JSON.stringify(data),
    },
    // Bạn có thể thêm cột cho nút sửa, xóa
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IDataRecord) => (
        <>
          {/* Ví dụ: thêm nút Edit, Delete */}
          <Button
            type="link"
            onClick={() => message.info("Chức năng sửa chưa hoàn thiện")}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => message.info("Chức năng xóa chưa hoàn thiện")}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <AdminLayout>
      <h2>Quản lý dữ liệu cho bảng: {tableId}</h2>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm dữ liệu
      </Button>
      <Table
        dataSource={dataRecords}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title="Thêm dữ liệu mới"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          {/* Ở đây, để đơn giản, bạn có thể nhập dữ liệu dưới dạng JSON string,
              hoặc tạo form động dựa trên cấu hình bảng. */}
          <Form.Item
            name="jsonData"
            label="Dữ liệu (JSON)"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập dữ liệu dưới dạng JSON",
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder='{"key": "value", ...}' />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm dữ liệu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default TableDetail;
