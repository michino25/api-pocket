import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  name: string;
  driveFileId: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  serviceAccountEmail: string;
  viewUrl: string;
  downloadUrl: string;
  createdAt: Date;
}

const FileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    driveFileId: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceAccountEmail: { type: String, required: true },
    viewUrl: { type: String, required: true },
    downloadUrl: { type: String, required: true },
  },
  { timestamps: true }
);

FileSchema.index({ uploadedBy: 1, driveFileId: 1 });

export default mongoose.models.File ||
  mongoose.model<IFile>("File", FileSchema);
