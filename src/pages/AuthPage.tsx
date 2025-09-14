import { useState } from "react";
import { supabase } from "../config/supabase";
import { SpinnerComponent } from "../components/common";

export const AuthPage = () => {
    const [isSignUp, setIsSignUp]   = useState<boolean>(false);
    const [email, setEmail]         = useState<string>('');
    const [password, setPassword]   = useState<string>('');
    const [loading, setLoading]     = useState<boolean>(false);
    const [error, setError]         = useState<string>('');
    const [message, setMessage]     = useState<string>('');

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = isSignUp
                ? await supabase.auth.signUp({ email, password })
                : await supabase.auth.signInWithPassword({ email, password });
                
            if (error) throw error;
            if (isSignUp) setMessage('¡Registro exitoso! Revisa tu correo para confirmar.');

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-full pt-20">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-1 text-teal-400">App de Pokémon</h1>
                <p className="text-center text-gray-400 mb-6">{isSignUp ? 'Crea una cuenta nueva' : 'Inicia sesión'}</p>
                <form onSubmit={handleAuth}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input data-testid="email-input" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2" htmlFor="password">Contraseña</label>
                        <input data-testid="password-input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                    </div>
                    {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                    {message && <p className="text-green-400 text-center mb-4">{message}</p>}
                    <button data-testid={isSignUp ? "signup-button" : "login-button"} type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:bg-gray-500">
                        {loading ? <SpinnerComponent /> : (isSignUp ? 'Registrarse' : 'Iniciar Sesión')}
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-400">
                    {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                    <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }} className="text-teal-400 hover:underline font-semibold ml-2">{isSignUp ? 'Inicia Sesión' : 'Regístrate'}</button>
                </p>
            </div>
        </div>
    );
};