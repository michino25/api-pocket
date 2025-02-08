import React from "react";
import AdminLayout from "../../components/AdminLayout";
import { useSession } from "next-auth/react";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession({ required: true });
  if (status === "loading") return <p>Loading...</p>;

  return (
    <AdminLayout>
      <h1>Dashboard</h1>
      <p>
        Welcome to your dashboard, {session?.user?.name || session?.user?.email}
        .
      </p>
      {/* Thêm các thống kê, biểu đồ, v.v. */}
    </AdminLayout>
  );
};

export default Dashboard;
