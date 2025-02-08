// src/models/Table.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IField {
  fieldName: string;
  fieldKey: string;
  dataType: "string" | "number" | "boolean" | "date" | "object" | "array";
  isPrimaryKey?: boolean;
}

export interface ITable extends Document {
  tableName: string;
  owner: string;
  fields: IField[];
  createdAt: Date;
  updatedAt: Date;
}

const FieldSchema: Schema = new Schema({
  fieldName: { type: String, required: true },
  fieldKey: { type: String, required: true },
  dataType: {
    type: String,
    required: true,
    enum: ["string", "number", "boolean", "date", "object", "array"],
  },
  isPrimaryKey: { type: Boolean, default: false },
});

const TableSchema: Schema = new Schema(
  {
    tableName: { type: String, required: true },
    owner: { type: String, required: true },
    fields: [FieldSchema],
  },
  { timestamps: true }
);

// Thiết lập compound index: mỗi owner chỉ được có mỗi tableName duy nhất
TableSchema.index({ owner: 1, tableName: 1 }, { unique: true });

export default mongoose.models.Table ||
  mongoose.model<ITable>("Table", TableSchema);
