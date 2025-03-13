"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import PrestadorCard from '@/components/PrestadorCard';
import { AnimatePresence } from 'framer-motion';

interface Prestador {
    _id: string;
    name: string;
    company: string;
    address: string;
    phone: string;
    service: string;
    rg: string;
    cpf: string;
    cnpj: string;
    logs: { entryTime: string; leaveTime?: string }[];
}

const PrestadoresPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [buttonState, setButtonState] = useState<Map<string, { checkInDisabled: boolean; checkOutDisabled: boolean }>>(new Map());

    const { data: prestadores = [], isLoading, error } = useQuery<Prestador[]>({
        queryKey: ["prestadores"],
        queryFn: async () => {
            const response = await axios.get("/api/prestador");
            return response.data;
        },
        staleTime: 5000,
    });

    const deletePrestador = useMutation({
        mutationFn: (prestadorId: string) =>
            axios.delete("/api/prestador", { data: { id: prestadorId } }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["prestadores"] }),
        onError: (error) => {
            console.error("Failed to delete prestador", error);
            alert("Failed to delete prestador");
        },
    });

    const updatePrestador = useMutation({
        mutationFn: ({ prestadorId, action }: { prestadorId: string; action: "entrada" | "saida" }) =>
            axios.put("/api/prestador", { id: prestadorId, action }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["prestadores"] }),
        onError: (error) => {
            console.error("Failed to update prestador", error);
            alert("Failed to update prestador");
        },
    });

    useEffect(() => {
        const newButtonState = new Map<string, { checkInDisabled: boolean; checkOutDisabled: boolean }>();
        prestadores.forEach((prestador) => {
            const lastLog = prestador.logs[prestador.logs.length - 1];
            newButtonState.set(prestador._id, {
                checkInDisabled: lastLog && !lastLog.leaveTime,
                checkOutDisabled: !lastLog || lastLog.leaveTime !== undefined,
            });
        });

        setButtonState(newButtonState);
    }, [prestadores]);

    const handleDelete = (prestadorId: string) => {
        if (confirm("Tem certeza que você quer deletar esse prestador?")) {
            deletePrestador.mutate(prestadorId);
        }
    };

    const handleCheckIn = (prestadorId: string) => {
        updatePrestador.mutate({ prestadorId, action: "entrada" });
    };

    const handleCheckOut = (prestadorId: string) => {
        updatePrestador.mutate({ prestadorId, action: "saida" });
    };

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {(error as Error).message}</p>;

    return (
        
        <div className="flex gap-4 flex-wrap">
            <AnimatePresence>
                {prestadores.map((prestador) => (
                    <PrestadorCard
                        key={prestador._id}
                        prestador={prestador}
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

export default PrestadoresPage;