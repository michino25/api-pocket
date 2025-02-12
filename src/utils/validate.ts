import { Rule } from "antd/es/form";

const validate = {
  number: [
    {
      pattern: new RegExp(/^\d+$/),
      message: "Only numbers are allowed",
    },
  ],
  numberDot: [
    {
      pattern: new RegExp(/^\d+(\.\d+)*$/),
      message: "Please enter only numbers and dots",
    },
  ],
  email: [
    {
      type: "email",
      message: "Invalid email format",
    },
  ],
  required: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  noOnlyWhiteSpace: [
    {
      pattern: new RegExp(/^\s*\S.*\s*$/),
      message: "This field is required",
    },
  ],
  name: [
    {
      pattern: new RegExp(/^(?! )[\p{L} ]*(?<! )$/u),
      message:
        "Name cannot contain numbers, special characters, or leading/trailing spaces",
    },
  ],
  noWhiteSpaceStartEnd: [
    {
      pattern: new RegExp(/^(?!\s).*?(?<!\s)$/),
      message: "Cannot start or end with a space",
    },
  ],
  noWhiteSpace: [
    {
      pattern: new RegExp(/^[^\s]+$/),
      message: "Whitespace is not allowed",
    },
  ],
  confirmPassword: [
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("Passwords do not match"));
      },
    }),
  ] as [Rule],
};

const validateFn = {
  min: (number: number) => [
    {
      min: number,
      message: `This field must have at least ${number} characters`,
    },
  ],
  max: (number: number) => [
    {
      max: number,
      message: `This field cannot exceed ${number} characters`,
    },
  ],
  minAndMax: (min: number, max: number) => [
    {
      min,
      max,
      message: `This field must be between ${min} and ${max} characters long`,
    },
  ],
  len: (number: number) => [
    {
      len: number,
      message: `This field must be exactly ${number} characters long`,
    },
  ],
};

type TypeValidateKey = keyof typeof validate;

const validator = (key: TypeValidateKey | TypeValidateKey[]) => {
  if (Array.isArray(key)) {
    return key.reduce(
      (result: Rule[], item) => result.concat(validate[item] as Rule[]),
      []
    );
  }
  return validate[key] as Rule[];
};

type TValidateFnKey = keyof typeof validateFn;

export const validatorFn = <T extends TValidateFnKey>(key: T) =>
  validateFn[key];

export default validator;
