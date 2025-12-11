'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // Add state for name
    const [userName, setUserName] = useState('Usuário');

    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = () => {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(loggedIn);

            // Load user data for feedback
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsed = JSON.parse(userData);
                setUserName(parsed.name);
            } else {
                setUserName('Usuário'); // Reset if not logged in or no user data
            }
        };

        checkLoginStatus(); // Initial check on mount

        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []); // Empty dependency array means this runs once on mount

    // Update effect to re-check user name if isLoggedIn changes (e.g., after login/logout)
    useEffect(() => {
        const u = localStorage.getItem('user');
        if (u) {
            setUserName(JSON.parse(u).name);
        } else {
            setUserName('Usuário');
        }
    }, [isLoggedIn]); // Re-run when login status changes

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Simple static check for prototype
        if (email === 'admin@ufc.br' && password === 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify({ name: 'Admin', email: 'admin@ufc.br', role: 'admin' }));
            setIsLoggedIn(true);
            setError('');
            router.refresh();
            setShowDropdown(false);
            router.push('/admin'); // Redirect admins to dashboard
        } else {
            setError('Credenciais inválidas. Tente admin@ufc.br / admin123');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setShowDropdown(false);
        router.push('/');
        router.refresh();
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Jornal<span style={{ color: 'var(--solar-gold)' }}>UFC</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/">Início</Link>
                    <Link href="/noticias/categoria/eventos">Eventos</Link>
                    <Link href="/noticias/categoria/pesquisa">Pesquisa</Link>
                    <Link href="/noticias/categoria/extensao">Extensão</Link>
                    <Link href="/noticias/categoria/editais">Editais</Link>
                </nav>

                <div className={styles.actions}>
                    <button className={styles.iconButton}>🔍</button>

                    <div className={styles.profileContainer} ref={dropdownRef}>
                        <button
                            className={styles.avatar}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <div className={styles.avatarImage} />
                            {isLoggedIn && <span className={styles.statusDot} />}
                        </button>

                        {showDropdown && (
                            <div className={styles.dropdown}>
                                {isLoggedIn ? (
                                    <>
                                        <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #eee' }}>
                                            Olá, <strong>{userName}</strong>
                                        </div>
                                        <Link href="/admin" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                                            📊 Painel de Controle
                                        </Link>
                                        <div className={styles.divider} />
                                        <button onClick={handleLogout} className={styles.dropdownItem} style={{ color: '#dc2626' }}>
                                            🚪 Sair
                                        </button>
                                    </>
                                ) : (
                                    <form onSubmit={handleLogin} className={styles.loginForm}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-blue)' }}>Acesso Rápido</p>

                                        {error && <div className={styles.errorMsg}>{error}</div>}

                                        <input
                                            type="text"
                                            placeholder="Email"
                                            className={styles.loginInput}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Senha"
                                            className={styles.loginInput}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button type="submit" className={styles.loginButton}>Entrar</button>

                                        <div className={styles.divider} />

                                        <div style={{ fontSize: '0.8rem', textAlign: 'center' }}>
                                            Não tem conta? <Link href="/cadastro" style={{ color: 'var(--primary-blue)' }} onClick={() => setShowDropdown(false)}>Cadastre-se</Link>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
