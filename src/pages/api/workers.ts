import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Worker from "@/models/Worker"; // Adjust the import path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongoose.connect(process.env.MONGODB_URI as string);

  switch (req.method) {
    case "GET":
      try {
        const workers = await Worker.find();
        res.status(200).json(workers);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch workers", error });
      }
      break;

    case "POST":
      try {
        const { name, role } = req.body;
        const worker = new Worker({ name, role });
        await worker.save();
        res.status(201).json(worker);
      } catch (error) {
        res.status(500).json({ message: "Failed to add worker", error });
      }
      break;

    case "PUT":
      try {
        const { id, action } = req.body;
        const worker = await Worker.findById(id);
        if (!worker) throw new Error("Worker not found");

        if (action === "entrada") {
          worker.logs.push({ entryTime: new Date() });
        } else if (action === "saida") {
          const lastLog = worker.logs[worker.logs.length - 1];
          if (lastLog && !lastLog.leaveTime) {
            lastLog.leaveTime = new Date();
          }
        }
        await worker.save();
        res.status(200).json(worker);
      } catch (error) {
        res.status(500).json({ message: "Failed to update worker", error });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body;
        await Worker.findByIdAndDelete(id);
        res.status(200).json({ message: "Worker deleted" });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete worker", error });
      }
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}