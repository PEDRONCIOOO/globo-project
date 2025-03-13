"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InputFocusBlur } from '@/components/InputFocusBlur';
import { motion } from 'framer-motion';

const VisitorsRegisterPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [rg, setRg] = useState("");
    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const addVisitor = useMutation({
        mutationFn: (newVisitor: { name: string; rg: string; cpf: string; phone: string; email: string; address: string }) =>
            axios.post("/api/visitors", newVisitor),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["visitors"] });
            setName("");
            setRg("");
            setCpf("");
            setPhone("");
            setEmail("");
            setAddress("");
        },
        onError: (error) => {
            console.error("Failed to add visitor", error);
            alert("Failed to add visitor");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && rg.trim() && cpf.trim() && phone.trim() && email.trim() && address.trim()) {
            addVisitor.mutate({ name, rg, cpf, phone, email, address });
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
                    Registre um Visitante
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
                        <label htmlFor="rg" className="block text-sm font-medium text-gray-300">RG:</label>
                        <InputFocusBlur
                            type="text"
                            id="rg"
                            name="rg"
                            value={rg}
                            onChange={(e) => setRg(e.target.value)}
                            required
                        />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                        <label htmlFor="cpf" className="block text-sm font-medium text-gray-300">CPF:</label>
                        <InputFocusBlur
                            type="text"
                            id="cpf"
                            name="cpf"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            required
                        />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Telefone:</label>
                        <InputFocusBlur
                            type="text"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email:</label>
                        <InputFocusBlur
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300">Endereço:</label>
                        <InputFocusBlur
                            type="text"
                            id="address"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </motion.div>
                    <motion.button
                        type="submit"
                        className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded transition-colors"
                        variants={inputVariants}
                    >
                        Registrar
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
};

export default VisitorsRegisterPage;