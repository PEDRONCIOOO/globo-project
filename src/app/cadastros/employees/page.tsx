"use client";

import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { InputFocusBlur } from "@/components/InputFocusBlur";

const EmployeesRegisterPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && role.trim()) {
            addWorker.mutate({ name, role });
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    };

    const inputVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen text-white p-6">
            <div className="max-w-7xl m-auto flex flex-col items-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold mb-4 mt-4 text-center"
                >
                    Registrar um Funcionário
                </motion.h1>
                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={formVariants}
                >
                    <motion.div variants={inputVariants}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome:</label>
                        <InputFocusBlur
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-300">Cargo:</label>
                        <InputFocusBlur
                            type="text"
                            id="role"
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        />
                    </motion.div>
                    <motion.button
                        type="submit"
                        className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded transition-colors"
                        variants={inputVariants}
                    >
                        Add Worker
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
};

export default EmployeesRegisterPage;