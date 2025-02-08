import React from "react";
import AdminLayout from "../../components/AdminLayout";

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <h1>Dashboard</h1>
      <p>Chào mừng bạn đến với Dashboard của API Pocket.</p>
      {/* Bạn có thể thêm thống kê, biểu đồ, hay thông tin khác ở đây */}
    </AdminLayout>
  );
};

export default Dashboard;
