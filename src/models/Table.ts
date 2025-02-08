import mongoose, { Schema, Document } from "mongoose";

// Định nghĩa interface cho Field
export interface IField {
  fieldName: string;
  fieldKey: string;
  dataType: "string" | "number" | "boolean" | "date" | "object" | "array";
  isPrimaryKey?: boolean;
}

// Định nghĩa interface cho Table
export interface ITable extends Document {
  tableName: string;
  owner: string; // Có thể là user id hoặc username
  fields: IField[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho Field (subdocument)
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

// Schema cho Table
const TableSchema: Schema = new Schema(
  {
    tableName: { type: String, required: true },
    owner: { type: String, required: true },
    fields: [FieldSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Table ||
  mongoose.model<ITable>("Table", TableSchema);
