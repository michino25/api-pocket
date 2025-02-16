import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@/hooks/useQuery";
import API_ROUTES from "@/commons/apis";
import CustomButton from "@/components/common/CustomButton";
import { ColumnsType } from "antd/es/table";
import { ITable } from "@/models/Table";
import DeleteButton from "@/components/common/DeleteButton";
import { formatToTimeString } from "@/utils/date";
import { useSidebarTableStore } from "@/stores/useSidebarTableStore";
import { useMutation } from "@/hooks/useMutation";
import { useNotification } from "@/hooks/useNotification";
import { Card } from "antd";
import CustomTable from "@/components/common/CustomTable";
import { splitString } from "@/utils/common";

const TableList: React.FC = () => {
  const { data: session, status } = useSession();
  const { setTables } = useSidebarTableStore();
  const notification = useNotification();

  const { data, isLoading, refetch } = useQuery({
    url: API_ROUTES.SCHEMA.LIST,
    config: { params: { userId: session?.user?.id } },
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (data?.data) {
      setTables(data.data);
    }
  }, [data, setTables]);

  const { mutate: deleteTable, isMutating } = useMutation({
    mutationFn: ({ _id }) => ({
      method: "DELETE",
      url: API_ROUTES.SCHEMA.DETAIL(_id),
    }),
    onSuccess: (_, { tableName }) => {
      notification.success(`Table ${tableName} deleted successfully`);
      refetch();
    },
    onError: (error) => {
      notification.error(`Error: ${error.message}`);
    },
  });

  const columns: ColumnsType<ITable> = [
    {
      title: "Table Name",
      dataIndex: "tableName",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      align: "center",
      render: formatToTimeString,
    },
    {
      title: "Schema",
      align: "center",
      render: (_, { _id }) => {
        const ids = splitString(_id as string);
        return (
          <CustomButton action="view" to={`/table/${ids[0]}/${ids[1]}/schema`}>
            View Schema
          </CustomButton>
        );
      },
    },
    {
      title: "Data",
      align: "center",
      render: (_, { _id }) => {
        const ids = splitString(_id as string);
        return (
          <CustomButton action="view" to={`/table/${ids[0]}/${ids[1]}/data`}>
            View Data
          </CustomButton>
        );
      },
    },
    {
      title: "API Docs",
      align: "center",
      render: (_, { _id }) => {
        const ids = splitString(_id as string);
        return (
          <CustomButton
            action="view"
            to={`/table/${ids[0]}/${ids[1]}/api-docs`}
          >
            View API Docs
          </CustomButton>
        );
      },
    },
    {
      title: "Delete",
      align: "center",
      render: (_, { _id, tableName }) => (
        <DeleteButton
          mutate={() => deleteTable({ _id, tableName })}
          isPending={isMutating}
          info={tableName}
          type="primary"
        >
          Delete table
        </DeleteButton>
      ),
    },
  ];

  return (
    <Card
      title="Table List"
      extra={
        <CustomButton type="primary" to="/tables/create" action="add">
          Create New Table
        </CustomButton>
      }
      loading={isLoading}
    >
      <CustomTable data={data?.data} unit="table" columns={columns} />
    </Card>
  );
};

export default TableList;
