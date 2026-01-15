'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/components/Shared/Auth.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Redirect if already logged in
        if (localStorage.getItem('isLoggedIn') === 'true') {
            router.push('/admin');
        }
    }, [router]);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulating the same logic from Header.js for consistency in prototype
        if (email === 'admin@ufc.br' && password === 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify({
                name: 'Admin',
                email: 'admin@ufc.br',
                role: 'admin'
            }));

            // Dispatch event to notify Header/other components
            window.dispatchEvent(new Event('storage'));

            router.push('/admin');
            router.refresh();
        } else {
            setError('Credenciais inválidas. Use admin@ufc.br / admin123');
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`glass-card ${styles.card}`}>
                <h1 className={styles.title}>Acessar Portal</h1>
                <p className={styles.subtitle}>Entre com sua conta institucional</p>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>E-mail</label>
                        <input
                            type="email"
                            required
                            placeholder="ex: aluno@ufc.br"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Senha</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Verificando...' : 'Entrar'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Não tem uma conta? <Link href="/cadastro">Cadastre-se aqui</Link></p>
                    <Link href="/" className={styles.backHome}>Voltar para a Home</Link>
                </div>
            </div>
        </div>
    );
}
