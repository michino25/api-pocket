// src/pages/admin/api-docs.tsx

import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { List, Typography } from "antd";
import { useSession } from "next-auth/react";

const { Title } = Typography;

interface ApiDoc {
  endpoint: string;
  description: string;
}

const ApiDocs: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const [apiDocs, setApiDocs] = useState<ApiDoc[]>([]);

  useEffect(() => {
    // Ví dụ: xây dựng tài liệu API động dựa trên email của user
    if (session) {
      const docs: ApiDoc[] = [
        {
          endpoint: `/api/${session.user?.email}/[tableName]`,
          description: "GET: List data, POST: Create new data",
        },
        {
          endpoint: `/api/${session.user?.email}/[tableName]/[id]`,
          description: "GET: Get detail, PUT: Update, DELETE: Soft delete",
        },
      ];
      setApiDocs(docs);
    }
  }, [session]);

  return (
    <AdminLayout>
      <Title level={2}>API Documentation</Title>
      <List
        itemLayout="horizontal"
        dataSource={apiDocs}
        renderItem={(doc) => (
          <List.Item>
            <List.Item.Meta
              title={doc.endpoint}
              description={doc.description}
            />
          </List.Item>
        )}
      />
    </AdminLayout>
  );
};

export default ApiDocs;
