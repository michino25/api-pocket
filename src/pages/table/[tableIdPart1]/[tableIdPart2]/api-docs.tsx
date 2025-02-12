import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useQuery } from "@/hooks/useQuery";
import { Card, Collapse, Tag, Typography, Divider } from "antd";
import { ITable } from "@/models/Table";
import { IResponse } from "@/commons/types";
import Pre from "@/components/common/Pre";
import API_ROUTES from "@/commons/apis";
import { preFormatter } from "@/utils/common";

const { Title, Paragraph, Text } = Typography;

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

const methodColors: Record<string, string> = {
  GET: "green",
  POST: "blue",
  DELETE: "red",
  PATCH: "purple",
  PUT: "orange",
};

const TableAPIDocumentation: React.FC = () => {
  const router = useRouter();
  const { tableIdPart1, tableIdPart2 } = router.query;
  const tableId = `${tableIdPart1}${tableIdPart2}`;

  const { data: session } = useSession({ required: true });
  const username = session?.user?.email || "username";

  const { data: tableRes, isLoading } = useQuery<IResponse<ITable>>({
    url: API_ROUTES.SCHEMA.DETAIL(tableId),
    enabled: !!tableId,
    queryKey: [tableId],
  });
  const table = tableRes?.data;
  const tableName = table?.tableName;

  const fullBaseEndpoint = `${apiBaseUrl}/${username}/${tableId}`;
  const securityHeader = btoa(btoa(tableId + username));

  // Create sample object from table fields
  const sampleItemObj = table
    ? table.fields.reduce(
        (acc, field) => ({ ...acc, [field.fieldKey]: field.dataType }),
        { _id: "string" }
      )
    : {};
  const sampleBodyObj = table
    ? table.fields.reduce(
        (acc, field) => ({ ...acc, [field.fieldKey]: field.dataType }),
        {}
      )
    : {};

  // Define endpoints
  const endpoints = table
    ? [
        {
          method: "GET",
          title: `List ${tableName}`,
          endpoint: fullBaseEndpoint,
          description: `Retrieve a list of ${tableName}.`,
          requests: [
            {
              type: "Query Parameters",
              content: preFormatter({
                ...sampleBodyObj,
                limit: 10,
                page: 1,
              }),
            },
          ],
          responseExample: preFormatter({
            success: true,
            data: [sampleItemObj],
            message: `List of ${tableName}`,
            page: 1,
            total: 256,
          }),
        },
        {
          method: "POST",
          title: `Create ${tableName}`,
          endpoint: fullBaseEndpoint,
          description: `Create a new ${tableName}.`,
          requests: [
            {
              type: "Request Body",
              content: preFormatter(sampleBodyObj),
            },
          ],
          responseExample: preFormatter({
            success: true,
            data: sampleItemObj,
            message: `Successfully created ${tableName}`,
          }),
        },
        {
          method: "GET",
          title: `Get ${tableName} Detail`,
          endpoint: `${fullBaseEndpoint}/{id}`,
          description: `Retrieve details of a ${tableName} by ID.`,
          requests: [
            {
              type: "Path Parameter",
              content: `id: string // The ID of the ${tableName}.`,
            },
          ],
          responseExample: preFormatter({
            success: true,
            data: sampleItemObj,
            message: `${tableName} details retrieved successfully`,
          }),
        },
        {
          method: "PUT",
          title: `Update ${tableName}`,
          endpoint: `${fullBaseEndpoint}/{id}`,
          description: `Update an existing ${tableName} by ID.`,
          requests: [
            {
              type: "Path Parameter",
              content: `id: string // The ID of the ${tableName} to update.`,
            },
            {
              type: "Request Body",
              content: preFormatter(sampleBodyObj),
            },
          ],
          responseExample: preFormatter({
            success: true,
            data: sampleItemObj,
            message: `${tableName} updated successfully`,
          }),
        },
        {
          method: "PATCH",
          title: `Patch ${tableName}`,
          endpoint: `${fullBaseEndpoint}/{id}`,
          description: `Partially update an existing ${tableName} by ID.`,
          requests: [
            {
              type: "Path Parameter",
              content: `id: string // The ID of the ${tableName} to patch.`,
            },
            {
              type: "Request Body",
              content: preFormatter(sampleBodyObj),
            },
          ],
          responseExample: preFormatter({
            success: true,
            data: sampleItemObj,
            message: `${tableName} patched successfully`,
          }),
        },
        {
          method: "DELETE",
          title: `Delete ${tableName}`,
          endpoint: `${fullBaseEndpoint}/{id}`,
          description: `Delete a row of ${tableName} by ID.`,
          requests: [
            {
              type: "Path Parameter",
              content: `id: string // The row ID of the ${tableName} to be deleted.`,
            },
          ],
          responseExample: preFormatter({
            success: true,
            data: null,
            message: `${tableName} deleted successfully`,
          }),
        },
      ]
    : [];

  const renderCollapseItem = (item: (typeof endpoints)[0], idx: number) => ({
    key: idx,
    label: <span className="font-semibold select-none">{item.title}</span>,
    extra: (
      <Tag className="select-none" color={methodColors[item.method]}>
        {item.method}
      </Tag>
    ),

    children: (
      <>
        <Title level={5}>Descriptions</Title>
        <Paragraph>{item.description}</Paragraph>
        <Divider />
        <Title level={5}>Endpoint</Title>
        <Pre>{item.endpoint}</Pre>
        <Divider />
        <Title level={5}>Request</Title>
        {item.requests.map(
          (req: { type: string; content: string }, index: number) => (
            <div key={index} className="mb-4">
              <Text type="secondary">{req.type}</Text>
              <Pre>{req.content}</Pre>
            </div>
          )
        )}
        <Divider />
        <Title level={5}>Response Example</Title>
        <Pre>{item.responseExample}</Pre>
      </>
    ),
  });

  return (
    <Card
      loading={isLoading}
      title={`API Documentation for Table: ${tableName || ""}`}
    >
      <div className="mb-5">
        <Title level={5}>Security</Title>
        <Paragraph>Include the following header in your request:</Paragraph>
        <Pre>{`x-api-key: ${securityHeader}`}</Pre>
      </div>

      <Collapse
        className="bg-transparent"
        items={endpoints.map(renderCollapseItem)}
        accordion
      />
    </Card>
  );
};

export default TableAPIDocumentation;
