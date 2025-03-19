import mongoose, { Schema, Document } from "mongoose";

interface IEntry {
  entryTime?: Date;
  leaveTime?: Date;
  faltou?: boolean; // New field to track absence
  date?: Date; // Date of the absence
}

export interface IWorker extends Document {
  name: string;
  cpf: string;
  nascimento: Date;
  admissao: Date;
  salario: string;
  numero: string;
  email: string;
  address: string;
  contract: string;
  role: string;
  logs: IEntry[];
  createdAt: Date;
}

const WorkerSchema = new Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  nascimento: { type: Date, required: true },
  admissao: { type: Date, required: true },
  salario: { type: String, required: true },
  numero: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  contract: { type: String, required: true },
  role: { type: String, required: true },
  logs: [
    {
      entryTime: { type: Date },
      leaveTime: { type: Date },
      faltou: { type: Boolean, default: false }, // Default to false
      date: { type: Date }, // Date of the absence
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Worker || mongoose.model<IWorker>("Worker", WorkerSchema);