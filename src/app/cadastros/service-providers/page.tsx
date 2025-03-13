"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { InputFocusBlur } from '@/components/InputFocusBlur';

const ServiceProvidersRegisterPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [service, setService] = useState("");
    const [rg, setRg] = useState("");
    const [cpf, setCpf] = useState("");
    const [cnpj, setCnpj] = useState("");

    const addServiceProvider = useMutation({
        mutationFn: (newServiceProvider: { name: string; company: string; address: string; phone: string; service: string; rg: string; cpf: string; cnpj: string }) =>
            axios.post("/api/prestador", newServiceProvider),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["serviceProviders"] });
            setName("");
            setCompany("");
            setAddress("");
            setPhone("");
            setService("");
            setRg("");
            setCpf("");
            setCnpj("");
        },
        onError: (error) => {
            console.error("Failed to add service provider", error);
            alert("Failed to add service provider");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && company.trim() && address.trim() && phone.trim() && service.trim() && rg.trim() && cpf.trim() && cnpj.trim()) {
            addServiceProvider.mutate({ name, company, address, phone, service, rg, cpf, cnpj });
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
            <div className="max-w-7xl flex flex-col items-center m-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold mb-4 mt-4 text-center"
                >
                    Registre um Prestador de Serviços
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
                        <label htmlFor="company" className="block text-sm font-medium text-gray-300">Empresa:</label>
                        <InputFocusBlur
                            type="text"
                            id="company"
                            name="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
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
                        <label htmlFor="service" className="block text-sm font-medium text-gray-300">Serviço:</label>
                        <InputFocusBlur
                            type="text"
                            id="service"
                            name="service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
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
                        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-300">CNPJ:</label>
                        <InputFocusBlur
                            type="text"
                            id="cnpj"
                            name="cnpj"
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
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

export default ServiceProvidersRegisterPage;