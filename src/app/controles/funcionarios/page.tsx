"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import WorkerCard from "@/components/WorkerCard";
import { AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/Spinner";

interface Worker {
  _id: string;
  name: string;
  role: string;
  logs: { entryTime: string; leaveTime?: string }[];
}

const WorkersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [buttonState, setButtonState] = useState<
    Map<string, { checkInDisabled: boolean; checkOutDisabled: boolean }>
  >(new Map());

  const {
    data: workers = [],
    isLoading,
    error,
  } = useQuery<Worker[]>({
    queryKey: ["workers"],
    queryFn: async () => {
      const response = await axios.get("/api/workers");
      return response.data;
    },
    staleTime: 5000,
  });

  const deleteWorker = useMutation({
    mutationFn: (workerId: string) =>
      axios.delete("/api/workers", { data: { id: workerId } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
    onError: (error) => {
      console.error("Failed to delete worker", error);
      alert("Failed to delete worker");
    },
  });

  const updateWorker = useMutation({
    mutationFn: ({
      workerId,
      action,
    }: {
      workerId: string;
      action: "entrada" | "saida";
    }) => axios.put("/api/workers", { id: workerId, action }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
    onError: (error) => {
      console.error("Failed to update worker", error);
      alert("Failed to update worker");
    },
  });

  useEffect(() => {
    const newButtonState = new Map<
      string,
      { checkInDisabled: boolean; checkOutDisabled: boolean }
    >();
    workers.forEach((worker) => {
      const lastLog = worker.logs[worker.logs.length - 1];
      newButtonState.set(worker._id, {
        checkInDisabled: lastLog && !lastLog.leaveTime,
        checkOutDisabled: !lastLog || lastLog.leaveTime !== undefined,
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <p className="text-center text-red-500">
        Error: {(error as Error).message}
      </p>
    );

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      <AnimatePresence>
        {workers.map((worker) => (
          <WorkerCard
            key={worker._id}
            worker={worker}
            buttonState={buttonState}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onDelete={handleDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WorkersPage;
