"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import VisitorCard from '@/components/VisitorCard';
import { AnimatePresence } from 'framer-motion';
import { Spinner } from '@/components/Spinner';

interface Visitor {
    _id: string;
    name: string;
    rg: string;
    cpf: string;
    phone: string;
    email: string;
    address: string;
    logs: { entryTime: string; leaveTime?: string }[];
}

const VisitorsPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [buttonState, setButtonState] = useState<Map<string, { checkInDisabled: boolean; checkOutDisabled: boolean }>>(new Map());

    const { data: visitors = [], isLoading, error } = useQuery<Visitor[]>({
        queryKey: ["visitors"],
        queryFn: async () => {
            const response = await axios.get("/api/visitors");
            return response.data;
        },
        staleTime: 5000,
    });

    const deleteVisitor = useMutation({
        mutationFn: (visitorId: string) =>
            axios.delete("/api/visitors", { data: { id: visitorId } }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["visitors"] }),
        onError: (error) => {
            console.error("Failed to delete visitor", error);
            alert("Failed to delete visitor");
        },
    });

    const updateVisitor = useMutation({
        mutationFn: ({ visitorId, action }: { visitorId: string; action: "entrada" | "saida" }) =>
            axios.put("/api/visitors", { id: visitorId, action }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["visitors"] }),
        onError: (error) => {
            console.error("Failed to update visitor", error);
            alert("Failed to update visitor");
        },
    });

    useEffect(() => {
        const newButtonState = new Map<string, { checkInDisabled: boolean; checkOutDisabled: boolean }>();
        visitors.forEach((visitor) => {
            const lastLog = visitor.logs[visitor.logs.length - 1];
            newButtonState.set(visitor._id, {
                checkInDisabled: lastLog && !lastLog.leaveTime,
                checkOutDisabled: !lastLog || lastLog.leaveTime !== undefined,
            });
        });

        setButtonState(newButtonState);
    }, [visitors]);

    const handleDelete = (visitorId: string) => {
        if (confirm("Tem certeza que você quer deletar esse visitante?")) {
            deleteVisitor.mutate(visitorId);
        }
    };

    const handleCheckIn = (visitorId: string) => {
        updateVisitor.mutate({ visitorId, action: "entrada" });
    };

    const handleCheckOut = (visitorId: string) => {
        updateVisitor.mutate({ visitorId, action: "saida" });
    };

if (isLoading) return <div className="flex items-center justify-center">
        <Spinner />
    </div>;
    if (error) return <p className="text-center text-red-500">Error: {(error as Error).message}</p>;

    return (
        <div className="grid grid-cols-3 justify-items-center max-w-[1000px] mx-auto">
            <AnimatePresence>
                {visitors.map((visitor) => (
                    <VisitorCard
                        key={visitor._id}
                        visitor={visitor}
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

export default VisitorsPage;