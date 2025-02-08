// src/pages/admin/tables.tsx

import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { Table, Button, message } from "antd";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface TableData {
  _id: string;
  tableName: string;
}

const TableList: React.FC = () => {
  const { data: session, status } = useSession({ required: true });
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      const fetchTables = async () => {
        setLoading(true);
        try {
          // Giả sử owner là email của user
          const res = await fetch(
            `/api/tables/list?owner=${session.user?.email}`
          );
          const json = await res.json();
          if (json.success) {
            setTables(json.data);
          } else {
            message.error("Failed to fetch tables");
          }
        } catch (error) {
          console.error(error);
          message.error("Error fetching tables");
        }
        setLoading(false);
      };

      fetchTables();
    }
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <AdminLayout>
      <h1>Your Tables</h1>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link href="/admin/tables/create">Create New Table</Link>
      </Button>
      <Table
        dataSource={tables}
        rowKey="_id"
        loading={loading}
        columns={[
          { title: "Table Name", dataIndex: "tableName", key: "tableName" },
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Button type="link">
                <Link href={`/admin/tables/${record._id}`}>View Data</Link>
              </Button>
            ),
          },
        ]}
      />
    </AdminLayout>
  );
};

export default TableList;
