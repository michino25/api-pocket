import {
  Checkbox,
  Form,
  FormInstance,
  FormListOperation,
  FormProps,
  Input,
  Select,
} from "antd";
import React from "react";
import CustomTable from "../common/CustomTable";
import CustomButton from "../common/CustomButton";
import { ColumnsType } from "antd/es/table";
import { IField } from "@/models/Table";
import validator from "@/utils/validate";

const DATA_TYPES = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
];

const DEFAULT_FIELD = {
  fieldName: null,
  fieldKey: null,
  dataType: null,
  isRequired: null,
  isPrimaryKey: null,
};

interface ITableSchemaForm {
  form: FormInstance;
}

const TableSchemaForm = ({
  form,
  initialValues,
  ...rest
}: ITableSchemaForm & Omit<FormProps, "form">) => {
  const handlePrimaryKeyChange = (index: number) => {
    const fields = form.getFieldValue("fields") || [];
    const updatedFields = fields.map((field: IField, i: number) => ({
      ...field,
      isPrimaryKey: i === index,
    }));
    form.setFieldsValue({ fields: updatedFields });
  };

  const columns: (
    remove: FormListOperation["remove"],
    total: number
  ) => ColumnsType = (remove, total) => [
    {
      title: "Primary Key",
      dataIndex: "isPrimaryKey",
      width: "15%",
      align: "center",
      render: (_, __, index) => (
        <Form.Item
          name={[index, "isPrimaryKey"]}
          rules={validator("required")}
          valuePropName="checked"
          noStyle
        >
          <Checkbox onChange={() => handlePrimaryKeyChange(index)} />
        </Form.Item>
      ),
    },
    {
      title: "Field Name",
      dataIndex: "fieldName",
      width: "25%",
      render: (_, __, index) => (
        <Form.Item
          name={[index, "fieldName"]}
          rules={validator("required")}
          noStyle
        >
          <Input placeholder="Enter field Name" />
        </Form.Item>
      ),
    },
    {
      title: "Field Key",
      dataIndex: "fieldKey",
      width: "25%",
      render: (_, __, index) => (
        <Form.Item
          name={[index, "fieldKey"]}
          rules={validator("required")}
          noStyle
        >
          <Input placeholder="Enter field key" />
        </Form.Item>
      ),
    },
    {
      title: "Data Type",
      dataIndex: "dataType",
      width: "25%",
      render: (_, __, index) => (
        <Form.Item
          name={[index, "dataType"]}
          rules={validator("required")}
          noStyle
        >
          <Select
            placeholder="Select data type"
            options={Object.values(DATA_TYPES)}
            className="w-full"
          />
        </Form.Item>
      ),
    },
    {
      title: "Required",
      dataIndex: "isRequired",
      width: "15%",
      align: "center",
      render: (_, __, index) => (
        <Form.Item
          name={[index, "isRequired"]}
          rules={validator("required")}
          valuePropName="checked"
          noStyle
        >
          <Checkbox />
        </Form.Item>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (_, __, index) => (
        <CustomButton
          disabled={(index === 0 && total === 1) || rest.disabled}
          onClick={() => remove(index)}
        >
          Remove
        </CustomButton>
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={
        initialValues || {
          fields: [DEFAULT_FIELD],
        }
      }
      {...rest}
    >
      <Form.Item
        name="tableName"
        label="Table Name"
        rules={[{ required: true, message: "Please enter table name" }]}
      >
        <Input placeholder="Table Name" />
      </Form.Item>

      <Form.List name="fields">
        {(fields, { add, remove }) => (
          <>
            <CustomTable
              unit=""
              data={fields}
              columns={columns(remove, fields.length)}
              rowKey="dataIndex"
              pagination={false}
            />
            <Form.Item>
              <CustomButton
                action="add"
                type="dashed"
                onClick={() => add(DEFAULT_FIELD)}
                block
                className="mt-4"
              >
                Add Field
              </CustomButton>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default TableSchemaForm;
