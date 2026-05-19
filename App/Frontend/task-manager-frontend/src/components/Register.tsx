import React, { useState } from 'react';
import { register, type RegisterData } from '../api/authService';

interface RegisterProps {
    onRegisterSuccess: () => void;
    onNavigateToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
    const [formData, setFormData] = useState<RegisterData>({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            await register(formData);
            setSuccessMessage("Konto zostało utworzone pomyślnie! Przekierowanie na stronę logowania...");

            setTimeout(() => {
                onRegisterSuccess();
            }, 2000);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Wystąpił błąd podczas rejestracji.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Utwórz konto</h1>
                    <p className="mt-2 text-sm text-slate-400">Dołącz do nas i zarządzaj swoimi zadaniami</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {successMessage && (
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20 text-left font-medium animate-pulse">
                            {successMessage}
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-left">
                            {error}
                        </div>
                    )}

                    {/* Name and surname */}
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Imię</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white transition-all focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Nazwisko</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white transition-all focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-sm font-medium text-slate-300">Adres Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white transition-all focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="przyklad@domena.com"
                        />
                    </div>

                    {/* Username */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-sm font-medium text-slate-300">Nazwa użytkownika</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white transition-all focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-sm font-medium text-slate-300">Hasło (min. 6 znaków)</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white transition-all focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* submit button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-indigo-600 mt-2 py-3 font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
                    >
                        {isLoading ? "Tworzenie konta..." : "Zarejestruj się"}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-slate-500">
                    Masz już konto?{" "}
                    <button
                        onClick={onNavigateToLogin}
                        className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors bg-transparent border-none cursor-pointer p-0"
                    >
                        Zaloguj się
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;