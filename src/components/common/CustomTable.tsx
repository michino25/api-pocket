import { Table, TableProps } from "antd";
import { useState } from "react";
import { ColumnsType, ColumnType } from "antd/es/table";

import { formatNumber } from "@/utils/number";

// Kiểu dữ liệu cho bảng
export type TableData = {
  _id: string;
  tableName: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
};

type Props<T> = {
  unit: string;
  data: T[] | undefined;
  columns: ColumnsType<T>;
  scroll?: string | number | true | undefined;
  hasPagination?: false;
  pageSize?: number;
} & TableProps<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTable = <T extends Record<string, any>>({
  unit,
  data,
  columns,
  loading,
  scroll = "max-content",
  rowKey = "_id",
  hasPagination,
  pageSize = 10,
  ...tableProps
}: Props<T>) => {
  const [page, setPage] = useState(1);

  const index: ColumnType<T> = {
    title: "Index",
    dataIndex: "index",
    align: "center",
    render: (_, __, index) => (page - 1) * pageSize + index + 1,
  };

  return (
    <Table<T>
      rowKey={rowKey as keyof T}
      size="middle"
      dataSource={data}
      columns={[index, ...columns]}
      pagination={
        hasPagination ?? {
          position: ["bottomRight"],
          className: "!mb-0",
          pageSize,
          onChange: setPage,
          showLessItems: true,
          showTotal: (total, range) =>
            `${formatNumber(total)}${" " + unit} | ${"from"} ${
              range[0]
            } ${"to"} ${range[1]}`,
        }
      }
      loading={loading}
      scroll={{ x: scroll }}
      {...tableProps}
    />
  );
};

export default CustomTable;
