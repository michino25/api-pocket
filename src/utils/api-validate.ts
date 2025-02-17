/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Data from "@/models/Data";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Function to parse and validate a value based on its data type.
 * If the value is invalid, an error is thrown.
 *
 * @param fieldKey - The name of the field.
 * @param dataType - The data type of the field ('string', 'number', 'boolean', 'date').
 * @param value - The value to be validated.
 * @returns The value converted to the correct type.
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
      // For any other data type, return the original value or handle according to your logic.
      return value;
  }
}

/**
 * Helper: Validate the fields in the input data.
 * - If checkRequired=true, then all required fields must be provided.
 * - Checks the data type based on the field's dataType.
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
    // Validate data type
    try {
      validatedData[fieldKey] = parseFieldValue(fieldKey, dataType, value);
    } catch (error: any) {
      errors.push(error.message);
    }
  });

  return { valid: errors.length === 0, errors, data: validatedData };
}

/**
 * Helper: Check the uniqueness of fields marked as isPrimaryKey.
 * If any field in the input data with isPrimaryKey=true already exists in the table,
 * an error is reported.
 *
 * @param tableId - The ID of the table.
 * @param fields - The array of fields in the table.
 * @param inputData - The validated input data from the client.
 * @param excludeRecordId - (Optional) Exclude the current record (used during update).
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
 * Helper: Validates the sort input object to ensure it adheres to the expected format.
 * Each value in the sort input must be either `1` (ascending) or `-1` (descending).
 * If any errors are found, they are collected and returned along with the validation result.
 *
 * @param sortInput - The raw sort input object to validate. Expected format: { fieldName: 1 | -1 }.
 * @param fields - An array of valid fields, where each field contains a `fieldKey` property.
 * @returns An object with the following properties:
 *   - valid: A boolean indicating whether the sort input is valid.
 *   - errors: An array of error messages describing any validation issues.
 *   - sort: A sanitized sort object containing only valid fields and values, preserving the input order.
 */
export function validateSort(
  sortInput: any,
  fields: any[]
): { valid: boolean; errors: string[]; sort: any } {
  const errors: string[] = [];
  const validatedSort: any = {};
  let sortObj;
  try {
    sortObj = typeof sortInput === "string" ? JSON.parse(sortInput) : sortInput;
  } catch (e) {
    sortObj = {};
  }

  const validFields = new Set(fields.map((field) => field.fieldKey));

  if (sortObj && typeof sortObj === "object" && !Array.isArray(sortObj)) {
    for (const [key, value] of Object.entries(sortObj)) {
      if (!validFields.has(key)) {
        errors.push(`Field '${key}' is not a valid sort field.`);
        continue;
      }
      const numValue = Number(value);
      if (isNaN(numValue) || (numValue !== 1 && numValue !== -1)) {
        errors.push(`Sort value for '${key}' must be 1 or -1.`);
        continue;
      }
      validatedSort[`data.${key}`] = numValue;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sort: validatedSort,
  };
}

/**
 * Helper: Build a query filter based on the provided parameters.
 * For each field in the table, if a corresponding key exists in the query,
 * add a condition.
 * Also handles "from" and "to" filters (applicable for number and date).
 */
export function buildFilterQuery(
  query: any,
  fields: any[]
): Record<string, any> {
  const filter: Record<string, any> = {};
  const errors: string[] = [];

  // Direct filtering (e.g., ?full_name=t, ?age=20)
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
          // For strings, use regex for search.
          filter[`data.${fieldKey}`] = { $regex: parsedValue, $options: "i" };
        } else {
          filter[`data.${fieldKey}`] = parsedValue;
        }
      } catch (error: any) {
        errors.push(`Error in query for field '${fieldKey}': ${error.message}`);
      }
    }
  });

  // Process "from" filters (>=)
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
      // Only support range filters for number and date
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

  // Process "to" filters (<=)
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

/**
 * Helper: Run a middleware function.
 *
 * @param req - The Next.js request object.
 * @param res - The Next.js response object.
 * @param fn - The middleware function to run.
 * @returns A promise that resolves when the middleware is complete.
 */
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
