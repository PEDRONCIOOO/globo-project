import mongoose, { Schema, Document } from "mongoose";

interface IEntry {
  entryTime: Date;
  leaveTime?: Date;
}

export interface IWorker extends Document {
  name: string;
  role: string;
  logs: IEntry[];
  createdAt: Date;
}

const WorkerSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  logs: [
    {
      entryTime: { type: Date, required: true },
      leaveTime: { type: Date },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Worker || mongoose.model<IWorker>("Worker", WorkerSchema);