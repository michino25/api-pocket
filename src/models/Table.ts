import mongoose, { Schema, Document } from "mongoose";

export interface IField {
  fieldName: string;
  fieldKey: string;
  dataType: "string" | "number" | "boolean" | "date";
  isRequired: boolean;
  isPrimaryKey: boolean;
}

export interface ITable extends Document {
  tableName: string;
  owner: mongoose.Types.ObjectId;
  fields: IField[];
  createdAt: Date;
  updatedAt: Date;
  _deleted?: boolean;
}

const FieldSchema: Schema = new Schema({
  fieldName: { type: String, required: true },
  fieldKey: { type: String, required: true },
  dataType: {
    type: String,
    required: true,
    enum: ["string", "number", "boolean", "date"],
  },
  isRequired: { type: Boolean, required: true },
  isPrimaryKey: { type: Boolean, required: true },
});

const TableSchema: Schema = new Schema(
  {
    tableName: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fields: [FieldSchema],
    _deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TableSchema.index({ owner: 1, _deleted: 1 });

export default mongoose.models.Table ||
  mongoose.model<ITable>("Table", TableSchema);
