"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const AddWorker: React.FC = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const addWorker = useMutation({
    mutationFn: (newWorker: { name: string; role: string }) =>
      axios.post("/api/workers", newWorker),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      alert("Worker added successfully");
      setName("");
      setRole("");
    },
    onError: (error) => {
      console.error("Failed to add worker", error);
      alert("Failed to add worker");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && role.trim()) {
      addWorker.mutate({ name, role });
    }
  };

  return (
    <main className="bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-center"
        >
          Add New Worker
        </motion.h1>
        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Worker Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500"
            required
          />
          <input
            type="text"
            placeholder="Worker Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-cyan-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded transition-colors"
            disabled={addWorker.isPending}
          >
            {addWorker.isPending ? "Adding..." : "Add Worker"}
          </button>
        </motion.form>
      </div>
    </main>
  );
};

export default AddWorker;