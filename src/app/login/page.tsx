"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { InputFocusBlur } from '@/components/InputFocusBlur';
import { ButtonGlitchBrightness } from '@/components/ButtonTransition';
import { LogoGloboo } from '../../../public';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            login();
            router.push('/');
        } else {
            setError(data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="flex justify-center mr-2">
                    <Image src={LogoGloboo} alt="Globoo Logo" width={120} height={100} />
                </div>
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Painel Administrativo</h1>
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center justify-center">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
                        <InputFocusBlur
                            type="text"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            feedbackError={error}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password:</label>
                        <InputFocusBlur
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            feedbackError={error}
                            required
                            autoComplete="off"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <ButtonGlitchBrightness type="submit" text="Login" />
                </form>
            </div>
        </div>
    );
}