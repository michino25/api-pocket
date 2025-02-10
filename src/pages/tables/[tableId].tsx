// src/pages/admin/tables/[tableId].tsx

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { useSession } from "next-auth/react";
import AdminLayout from "@/components/AdminLayout";

interface DataRecord {
  _id: string;
  data: any;
}

const TableDetail: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const router = useRouter();
  const { tableId } = router.query;
  const [dataRecords, setDataRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    if (!tableId || typeof tableId !== "string") return;
    setLoading(true);
    try {
      const res = await fetch(`/api/data/${tableId}`);
      const json = await res.json();
      if (json.success) {
        setDataRecords(json.data);
      } else {
        message.error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching data");
    }
    setLoading(false);
  }, [tableId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, tableId]);

  const handleAdd = async (values: any) => {
    if (!tableId || typeof tableId !== "string") return;
    try {
      const res = await fetch(`/api/data/${tableId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.email, data: values }),
      });
      const json = await res.json();
      if (json.success) {
        message.success("Data added successfully");
        setIsModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error("Failed to add data");
      }
    } catch (error) {
      message.error("Error adding data");
      console.error(error);
    }
  };

  if (!tableId) return <p>Loading...</p>;

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (data: any) => JSON.stringify(data),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: DataRecord) => (
        <>
          <Button
            type="link"
            onClick={() => message.info("Edit not implemented")}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => message.info("Delete not implemented")}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <AdminLayout>
      <h2>Data Management for Table: {tableId}</h2>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Add Data
      </Button>
      <Table
        dataSource={dataRecords}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
      <Modal
        title="Add New Data"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="jsonData"
            label="Data (JSON)"
            rules={[
              { required: true, message: "Please enter valid JSON data" },
            ]}
          >
            <Input.TextArea rows={4} placeholder='{"key": "value"}' />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Data
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default TableDetail;
