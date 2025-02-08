import React from "react";
import AdminLayout from "../../components/AdminLayout";
import { List, Typography } from "antd";

const { Title } = Typography;

// Dữ liệu tĩnh để demo. Sau này bạn sẽ thay thế bằng dữ liệu từ API.
const tablesData = [
  { id: "1", name: "Bảng 1" },
  { id: "2", name: "Bảng 2" },
];

const TableList: React.FC = () => {
  return (
    <AdminLayout>
      <Title level={2}>Danh sách bảng</Title>
      <List
        bordered
        dataSource={tablesData}
        renderItem={(item) => (
          <List.Item>
            {item.name}
            {/* Ở đây bạn có thể thêm các nút Edit, Delete, v.v. */}
          </List.Item>
        )}
      />
    </AdminLayout>
  );
};

export default TableList;
