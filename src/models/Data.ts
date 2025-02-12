import mongoose, { Schema, Document } from "mongoose";

export interface IData extends Document {
  tableId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  data: unknown;
  _deleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DataSchema: Schema = new Schema(
  {
    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    data: { type: Schema.Types.Mixed, required: true },
    _deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Data ||
  mongoose.model<IData>("Data", DataSchema);
