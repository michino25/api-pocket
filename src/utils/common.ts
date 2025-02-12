import { FormItemProps, InputNumberProps, notification } from "antd";
import { AxiosError } from "axios";
import { DefaultOptionType } from "antd/es/select";

import { unAccent } from "./string";
import {
  formatValueDecimalToNumber,
  formatValueToNumber,
  parserValueDecimalToNumber,
  parserValueToNumber,
} from "./number";
import dayjs from "dayjs";

export const hasItemInList = <Type = unknown>(item: Type, list: Type[]) =>
  new Set(list).has(item);

export const objToArr = (obj: Record<string, unknown>): unknown[] =>
  Object.values(obj).map((i) => i);

export const arrToObj = <T>(arr: T[]): { [key: number]: T } => {
  return arr.reduce((acc, item, index) => {
    acc[index] = item;
    return acc;
  }, {} as { [key: number]: T });
};

export const onError = (error: unknown) => {
  if (error instanceof AxiosError) {
    notification.error({
      message: error.name,
      description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau.",
    });
  }
};

export const filterOption = (input: string, option?: DefaultOptionType) => {
  if (!option) return false;

  if (option.label) {
    return (
      unAccent((option.label as string).toLowerCase().trim()).indexOf(
        unAccent(input.toLowerCase().trim())
      ) !== -1
    );
  }
  return true;
};

export const SELECT_FILTER = {
  filterOption,
  showSearch: true,
};

export const formatInputNumber: Pick<InputNumberProps, "formatter" | "parser"> =
  {
    formatter: formatValueToNumber,
    parser: parserValueToNumber,
  };

export const formatInputDecimalNumber: Pick<
  InputNumberProps,
  "formatter" | "parser"
> = {
  formatter: formatValueDecimalToNumber,
  parser: parserValueDecimalToNumber,
};

export const datePickerFormItemHelper: Pick<
  FormItemProps,
  "getValueProps" | "normalize"
> = {
  getValueProps: (value) => ({ value: value && dayjs(value) }),
  normalize: (value) => value && value.toISOString(),
};

export const splitString = (input: string) => {
  const mid = Math.ceil(input.length / 2);
  return [input.slice(0, mid), input.slice(mid)];
};

export const preFormatter = (obj: Record<string, unknown>) =>
  JSON.stringify(obj, null, 2);
