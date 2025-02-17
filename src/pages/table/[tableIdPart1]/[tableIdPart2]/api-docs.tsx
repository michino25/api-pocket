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
import { encryptApiKey } from "@/utils/encrypt";

const { Title, Paragraph, Text } = Typography;

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

const methodColors: Record<string, string> = {
  GET: "green",
  POST: "blue",
  DELETE: "red",
  PATCH: "purple",
  PUT: "orange",
};

const filterFromToObj = (obj: Record<string, string>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value === "number" || value === "date"
    )
  );
};

const queryParametersGuidelines = `
Query Parameters Guidelines:

limit (number, optional):
  - Specifies the maximum number of records per page.
  - If omitted (and no page is provided), all matching records are returned.

page (number, optional):
  - Specifies the page number to retrieve (starting at 1).
  - Note: 'page' must be provided together with 'limit'; otherwise, an error is returned.

from (JSON, optional):
  - Sets a lower bound for filtering number or date fields.
  - Example: from={"age":20} filters for records where age ≥ 20.

to (JSON, optional):
  - Sets an upper bound for filtering number or date fields.
  - Example: to={"age":30} filters for records where age ≤ 30.

sort (JSON, optional):
  - Specifies the sorting order for the results.
  - The key is the field name, and the value determines the sort direction:
      • 1: Ascending order (smallest to largest, A-Z, earliest to latest).
      • -1: Descending order (largest to smallest, Z-A, latest to earliest).
  - Multiple fields can be sorted by providing multiple key-value pairs. 
  - The sort order follows the sequence of the keys provided.

Other Field Filters:
  - For string fields: performs a case-insensitive "contains" search.
  - For boolean fields: matches the value exactly.
  - For number and date fields:
      • If an exact value is provided (e.g. age=25), the filter matches records with that value.
      • If 'from' and/or 'to' are provided, they define a range.
      • If both an exact value and range filters are provided, both conditions are applied.
`;

const TableAPIDocumentation: React.FC = () => {
  const router = useRouter();
  const { tableIdPart1, tableIdPart2 } = router.query;
  const tableId = `${tableIdPart1 || ""}${tableIdPart2 || ""}`;

  const { data: session } = useSession({ required: true });
  const userId = session?.user?.id;

  const { data: tableRes, isLoading } = useQuery<IResponse<ITable>>({
    url: API_ROUTES.SCHEMA.DETAIL(tableId),
    enabled: !!tableId,
    queryKey: [tableId],
  });
  const table = tableRes?.data;
  const tableName = table?.tableName;

  const fullBaseEndpoint = `${apiBaseUrl}/${userId}/${tableId}`;

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
  const sortBodyObj = table
    ? table.fields.reduce((acc, field) => ({ ...acc, [field.fieldKey]: 1 }), {})
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
              content:
                preFormatter({
                  ...sampleBodyObj,
                  from: filterFromToObj(sampleBodyObj),
                  to: filterFromToObj(sampleBodyObj),
                  sort: sortBodyObj,
                  limit: 10,
                  page: 1,
                }) +
                "\n" +
                queryParametersGuidelines,
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
        <Title level={5}>Security</Title>
        <Paragraph>
          Include an <Text code>x-api-key</Text> header in your request:
        </Paragraph>
        <Pre>{encryptApiKey(tableId, userId!, item.method)}</Pre>
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
      <Collapse
        className="bg-transparent"
        items={endpoints.map(renderCollapseItem)}
        accordion
      />
    </Card>
  );
};

export default TableAPIDocumentation;
