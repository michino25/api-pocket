import numeral from "numeral";

export const formatNumber = (number?: number) => {
  if (number === undefined) return "";
  return numeral(number).format("0,0");
};

export const formatDecimalNumber = (number?: number) => {
  if (number === undefined) return "";
  return numeral(number).format("0,0.[00]");
};

export const formatNumberAbbreviation = (number?: number) => {
  if (number === undefined) return "";
  return numeral(number).format("0,0.[00]a");
};

export const formatBytes = (number?: number) => {
  if (number === undefined) return "";
  return numeral(number).format("'0. b'");
};

// Input Number

export const parserValueToNumber = (value?: string | null) => {
  if (value === "0") return value;
  return numeral(value).value() || "";
};

export const formatValueToNumber = (value?: number | string) => {
  if (value === undefined || value === "") return "";
  return numeral(value).format("0,0");
};

export const parserValueDecimalToNumber = (value?: string | null) => {
  if (value === undefined || value === null || value === "") return "";
  if (value === "-") return "-";
  if (value === ".") return "0.";
  if (value.endsWith(".")) return value;
  return numeral(value).value() ?? "";
};

export const formatValueDecimalToNumber = (value?: number | string) => {
  if (value === undefined || value === "" || value === null) return "";
  if (typeof value === "string" && value.endsWith(".")) return value;
  return numeral(value).format("0,0.[0]");
};
