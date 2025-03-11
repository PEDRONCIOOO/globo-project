"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputFocusBlur } from '@/components/InputFocusBlur';
import { ButtonGlitchBrightness } from '@/components/ButtonTransition';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();

        if (response.ok) {
            setSuccess('User registered successfully');
            setError('');
            // Redirect to the login page or another page after successful registration
            router.push('/login');
        } else {
            setError(data.message);
            setSuccess('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="flex justify-center">
                    <h1>Registre-se</h1>
                </div>
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name:</label>
                        <InputFocusBlur
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            feedbackError={error}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
                        <InputFocusBlur
                            type="email"
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
                    {success && <p className="text-sm text-green-500">{success}</p>}
                    <ButtonGlitchBrightness type="submit" text="Register" />
                </form>
            </div>
        </div>
    );
}