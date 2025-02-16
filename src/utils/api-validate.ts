/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Data from "@/models/Data";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Hàm chuyển đổi và validate giá trị dựa theo kiểu dữ liệu.
 * Nếu giá trị không phù hợp, hàm sẽ ném lỗi.
 *
 * @param fieldKey - Tên của field
 * @param dataType - Kiểu dữ liệu của field ('string', 'number', 'boolean', 'date')
 * @param value - Giá trị cần kiểm tra
 * @returns Giá trị đã được chuyển đổi về đúng kiểu
 */
export function parseFieldValue(
  fieldKey: string,
  dataType: string,
  value: any
): any {
  switch (dataType) {
    case "string":
      if (typeof value !== "string") {
        throw new Error(`Field '${fieldKey}' must be a string.`);
      }
      return value;

    case "number": {
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Field '${fieldKey}' must be a number.`);
      }
      return num;
    }

    case "boolean": {
      if (value === "true" || value === true) {
        return true;
      }
      if (value === "false" || value === false) {
        return false;
      }
      throw new Error(`Field '${fieldKey}' must be a boolean.`);
    }

    case "date": {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error(`Field '${fieldKey}' must be a valid date.`);
      }
      return date;
    }

    default:
      // Nếu có kiểu dữ liệu khác, trả về giá trị gốc hoặc xử lý theo logic của bạn.
      return value;
  }
}

/**
 * Helper: Validate các field trong dữ liệu đầu vào
 * - Nếu checkRequired=true thì phải có đầy đủ các trường bắt buộc
 * - Kiểm tra kiểu dữ liệu dựa trên dataType của field
 */
export function validateDataFields(
  input: any,
  fields: any[],
  checkRequired = true
): { valid: boolean; errors: string[]; data: any } {
  const errors: string[] = [];
  const validatedData: any = {};

  fields.forEach((field) => {
    const { fieldKey, dataType, isRequired } = field;
    const value = input[fieldKey];
    if (value === undefined) {
      if (checkRequired && isRequired) {
        errors.push(`Field '${fieldKey}' is required.`);
      }
      return;
    }
    // Kiểm tra kiểu dữ liệu
    try {
      validatedData[fieldKey] = parseFieldValue(fieldKey, dataType, value);
    } catch (error: any) {
      errors.push(error.message);
    }
  });

  return { valid: errors.length === 0, errors, data: validatedData };
}

/**
 * Helper: Kiểm tra tính duy nhất của các trường isPrimaryKey
 * Nếu trong dữ liệu đầu vào có field nào có isPrimaryKey=true mà đã tồn tại trong bảng, báo lỗi
 * @param tableId - ID của bảng
 * @param fields - Mảng các field của bảng
 * @param inputData - Dữ liệu đã validate từ client
 * @param excludeRecordId - (Tùy chọn) loại trừ record hiện tại (dùng khi update)
 */
export async function checkPrimaryUnique(
  tableId: string,
  fields: any[],
  inputData: any,
  excludeRecordId?: string
): Promise<string[]> {
  const errors: string[] = [];
  for (const field of fields) {
    const { fieldKey, isPrimaryKey } = field;
    if (isPrimaryKey && inputData[fieldKey] !== undefined) {
      const query: any = {
        tableId,
        _deleted: false,
        [`data.${fieldKey}`]: inputData[fieldKey],
      };
      if (excludeRecordId) {
        query._id = { $ne: excludeRecordId };
      }
      const exists = await Data.findOne(query);
      if (exists) {
        errors.push(
          `Field '${fieldKey}' must be unique. Value '${inputData[fieldKey]}' already exists.`
        );
      }
    }
  }
  return errors;
}

/**
 * Helper: Xây dựng query filter dựa trên các tham số truyền vào
 * Với mỗi field trong table, nếu có key tương ứng thì thêm điều kiện
 * Cũng xử lý các filter dạng "from" và "to" (áp dụng với number, date)
 */
export function buildFilterQuery(
  query: any,
  fields: any[]
): Record<string, any> {
  const filter: Record<string, any> = {};
  const errors: string[] = [];

  // Lọc theo field trực tiếp (ví dụ: ?full_name=t, ?age=20)
  fields.forEach((field) => {
    const { fieldKey, dataType } = field;
    if (query[fieldKey] !== undefined) {
      try {
        const parsedValue = parseFieldValue(
          fieldKey,
          dataType,
          query[fieldKey]
        );
        if (dataType === "string") {
          // Với string, chúng ta có thể sử dụng regex để tìm kiếm.
          filter[`data.${fieldKey}`] = { $regex: parsedValue, $options: "i" };
        } else {
          filter[`data.${fieldKey}`] = parsedValue;
        }
      } catch (error: any) {
        errors.push(`Error in query for field '${fieldKey}': ${error.message}`);
      }
    }
  });

  // Xử lý filter dạng "from" (>=)
  if (query.from) {
    let fromObj;
    try {
      fromObj =
        typeof query.from === "string" ? JSON.parse(query.from) : query.from;
    } catch (e) {
      fromObj = {};
    }
    for (const key in fromObj) {
      const field = fields.find((f) => f.fieldKey === key);
      // Chỉ hỗ trợ filter range cho number và date
      if (field && (field.dataType === "number" || field.dataType === "date")) {
        try {
          const parsedValue = parseFieldValue(
            key,
            field.dataType,
            fromObj[key]
          );
          filter[`data.${key}`] = {
            ...filter[`data.${key}`],
            $gte: parsedValue,
          };
        } catch (error: any) {
          errors.push(
            `Invalid data type for filter 'from' of field '${key}': ${error.message}`
          );
        }
      }
    }
  }

  // Xử lý filter dạng "to" (<=)
  if (query.to) {
    let toObj;
    try {
      toObj = typeof query.to === "string" ? JSON.parse(query.to) : query.to;
    } catch (e) {
      toObj = {};
    }
    for (const key in toObj) {
      const field = fields.find((f) => f.fieldKey === key);
      if (field && (field.dataType === "number" || field.dataType === "date")) {
        try {
          const parsedValue = parseFieldValue(key, field.dataType, toObj[key]);
          filter[`data.${key}`] = {
            ...filter[`data.${key}`],
            $lte: parsedValue,
          };
        } catch (error: any) {
          errors.push(
            `Invalid data type for filter 'to' of field '${key}': ${error.message}`
          );
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, filter };
}

export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: any
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
