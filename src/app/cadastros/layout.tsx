'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserPlus, Building2 } from 'lucide-react';
import { CardRevealedPointer } from '@/components/CardReveled';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col min-h-screen">
            <header className="text-white p-4">
                <nav className="flex justify-center space-x-4">
                    <Link href="/cadastros/employees">
                        <CardRevealedPointer>
                            <span className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium ${pathname === '/cadastros/employees' ? 'bg-cyan-600' : ''}`}>
                                <Users className="h-4 w-4 mr-2" />
                                Funcionários
                            </span>
                        </CardRevealedPointer>
                    </Link>
                    <Link href="/cadastros/visitors">
                        <CardRevealedPointer>
                            <span className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium ${pathname === '/cadastros/visitors' ? 'bg-cyan-600' : ''}`}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Visitantes
                            </span>
                        </CardRevealedPointer>
                    </Link>
                    <Link href="/cadastros/service-providers">
                        <CardRevealedPointer>
                            <span className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium ${pathname === '/cadastros/service-providers' ? 'bg-cyan-600' : ''}`}>
                                <Building2 className="h-4 w-4 mr-2" />
                                Prestadores de Serviços
                            </span>
                        </CardRevealedPointer>
                    </Link>
                </nav>
            </header>
            <main className="flex-1 p-4">
                {children}
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                &copy; 2025 Created by Globoo Developers.
            </footer>
        </div>
    );
};

export default Layout;