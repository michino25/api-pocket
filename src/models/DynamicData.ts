import mongoose, { Schema, Document } from "mongoose";

export interface IDynamicData extends Document {
  tableId: string;
  userId: string;
  data: unknown;
  _deleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DynamicDataSchema: Schema = new Schema(
  {
    tableId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    data: { type: Schema.Types.Mixed, required: true },
    _deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.DynamicData ||
  mongoose.model<IDynamicData>("DynamicData", DynamicDataSchema);
