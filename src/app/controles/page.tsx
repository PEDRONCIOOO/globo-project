"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import WorkerCard from "@/components/WorkerCard"; // Adjust the import path as needed
import { AnimatePresence, motion } from "framer-motion";
import LoadingIcons from "react-loading-icons";

// Define the Log interface for type safety (matches your Worker model)
interface Log {
  entryTime: string; // Already a string from the server
  leaveTime?: string; // Already a string from the server
}

// Define the Worker interface for type safety (matches your Worker model)
interface Worker {
  _id: string;
  name: string;
  role: string;
  logs: Log[];
  createdAt: Date;
}

const ControlsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [buttonState, setButtonState] = useState<Map<string, { checkInDisabled: boolean; checkOutDisabled: boolean }>>(new Map());

  // Fetch workers using useQuery
  const { data: workers = [], isLoading, error } = useQuery<Worker[]>({
    queryKey: ["workers"],
    queryFn: async () => {
      const response = await axios.get("/api/workers");
      return response.data;
    },
    staleTime: 5000, // Data is fresh for 5 seconds
  });

  // Mutation to add a worker
  const addWorker = useMutation({
    mutationFn: (newWorker: { name: string; role: string }) =>
      axios.post("/api/workers", newWorker),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      setName("");
      setRole("");
    },
    onError: (error) => {
      console.error("Failed to add worker", error);
      alert("Failed to add worker");
    },
  });

  // Mutation to delete a worker
  const deleteWorker = useMutation({
    mutationFn: (workerId: string) =>
      axios.delete("/api/workers", { data: { id: workerId } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
    onError: (error) => {
      console.error("Failed to delete worker", error);
      alert("Failed to delete worker");
    },
  });

  // Mutation to update a worker (Entrada or Saída)
  const updateWorker = useMutation({
    mutationFn: ({ workerId, action }: { workerId: string; action: "entrada" | "saida" }) =>
      axios.put("/api/workers", { id: workerId, action }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
    onError: (error) => {
      console.error("Failed to update worker", error);
      alert("Failed to update worker");
    },
  });

  // Update button states based on worker logs
  useEffect(() => {
    const newButtonState = new Map<string, { checkInDisabled: boolean; checkOutDisabled: boolean }>();
    workers.forEach((worker) => {
      const lastLog = worker.logs[worker.logs.length - 1];
      newButtonState.set(worker._id, {
        checkInDisabled: lastLog && !lastLog.leaveTime, // Disable if last entry has no leave time
        checkOutDisabled: !lastLog || lastLog.leaveTime !== undefined, // Disable if no log or last log has leave time
      });
    });
    setButtonState(newButtonState);
  }, [workers]);

  const handleDelete = (workerId: string) => {
    if (confirm("Are you sure you want to delete this worker?")) {
      deleteWorker.mutate(workerId);
    }
  };

  const handleCheckIn = (workerId: string) => {
    updateWorker.mutate({ workerId, action: "entrada" });
  };

  const handleCheckOut = (workerId: string) => {
    updateWorker.mutate({ workerId, action: "saida" });
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {(error as Error).message}</p>;

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Página de Controles</h1>
        <p className="mb-6">Bem-vindo aos controles, disponíveis:</p>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Nome do Funcionário"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Cargo do Funcionário"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => name.trim() && role.trim() && addWorker.mutate({ name, role })}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded transition-colors"
          >
            Adicionar
          </button>
        </motion.div>
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingIcons.Puff className="h-8 w-8" />
          </div>
        ) : (
          <AnimatePresence>
            {workers.map((worker) => (
              <WorkerCard
                key={worker._id}
                worker={{
                  _id: worker._id,
                  name: worker.name,
                  role: worker.role, // Include the role
                  logs: worker.logs.map((log) => ({
                    entryTime: new Date(log.entryTime).toISOString(), // Ensure it's a string
                    leaveTime: log.leaveTime ? new Date(log.leaveTime).toISOString() : undefined, // Ensure it's a string if exists
                  })),
                }}
                buttonState={buttonState}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ControlsPage;