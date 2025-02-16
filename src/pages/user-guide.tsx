import React from "react";
import { Card, Typography, Divider, List, Collapse } from "antd";
const { Title, Paragraph, Text } = Typography;

const collapseItems = [
  {
    key: "1",
    label: "1. Sign In or Create an Account",
    children: (
      <Paragraph>
        - Go to{" "}
        <a href="/auth/signin" target="_blank" rel="noreferrer">
          API Pocket
        </a>
        .
        <br />- If you already have an account, log in using your username and
        password or an OAuth provider.
        <br />- If you don&apos;t have an account, click Sign Up and follow the
        registration steps.
      </Paragraph>
    ),
  },
  {
    key: "2",
    label: "2. Create a Data Table",
    children: (
      <Paragraph>
        - Navigate to the Data Management section.
        <br />- Click Create Table and enter the required details (table name,
        column names, data types, etc.).
        <br />- Click Save to confirm.
      </Paragraph>
    ),
  },
  {
    key: "3",
    label: "3. Generate API Endpoints",
    children: (
      <Paragraph>
        - Once the table is created, click Generate API.
        <br />- API Pocket will automatically create endpoints for GET, POST,
        PUT, PATCH, and DELETE operations.
        <br />- Your API is now ready to use.
      </Paragraph>
    ),
  },
  {
    key: "4",
    label: "4. Manage Your Data",
    children: (
      <Paragraph>
        - Select a table from the dashboard.
        <br />- Use the available options to add, edit, or delete records.
        <br />- The changes will reflect in your API responses.
      </Paragraph>
    ),
  },
  {
    key: "5",
    label: "5. Access API Documentation",
    children: (
      <Paragraph>
        - Go to the API Documentation section.
        <br />- You can view details of your API endpoints and test requests
        directly from the interface.
      </Paragraph>
    ),
  },
];

const UserGuide = () => {
  return (
    <Card title="User Guide - API Pocket">
      <Typography>
        {/* Introduction */}
        <Paragraph>
          <Text strong>API Pocket</Text> is a tool that allows you to create
          APIs quickly without setting up a backend or database. With just a few
          simple steps, you can create tables, configure APIs, and manage data
          with ease.
        </Paragraph>
        <Paragraph>
          The system supports the following API operations:{" "}
          <Text code>GET</Text> | <Text code>POST</Text> | <Text code>PUT</Text>{" "}
          | <Text code>PATCH</Text> | <Text code>DELETE</Text>.
        </Paragraph>
        <Divider />
        {/* Key Features */}
        <Title level={5}>Key Features</Title>
        <List
          itemLayout="horizontal"
          className="[&_.ant-list-item]:m-0 [&_.ant-list-item]:py-1"
          dataSource={[
            "- Quick API creation: Automatically generate APIs from data tables.",
            "- Secure authentication: Sign in using username/password or OAuth.",
            "- Data management: Easily add, update, and delete records.",
            "- API documentation: View and test API endpoints within the UI.",
            "- Access control: Enable or disable APIs as needed.",
          ]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
          split={false}
        />
        <Divider />
        {/* User Guide */}
        <Title level={5}>How to Use API Pocket</Title>
        <Collapse
          accordion
          items={collapseItems}
          className="bg-transparent [&_.ant-collapse-header]:font-semibold"
        />
      </Typography>
    </Card>
  );
};

export default UserGuide;
