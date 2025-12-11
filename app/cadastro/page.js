'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/components/Shared/Auth.module.css'; // Shared styles

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student' // Default role
    });
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();

        // In a real app, send to API to create user in DB
        // For prototype: Simulate registration and auto-login
        localStorage.setItem('user', JSON.stringify(formData));
        localStorage.setItem('isLoggedIn', 'true');

        alert('Cadastro realizado com sucesso!');
        router.push('/admin'); // Redirect to dashboard area
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleRegister} className={`glass-card ${styles.card}`}>
                <h1 className={styles.title}>Criar Conta UFC</h1>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Nome Completo</label>
                    <input
                        required
                        type="text"
                        className={styles.input}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: João da Silva"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email Institucional</label>
                    <input
                        required
                        type="email"
                        className={styles.input}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="@alu.ufc.br"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Senha</label>
                    <input
                        required
                        type="password"
                        className={styles.input}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Crie uma senha segura"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Sou:</label>
                    <select
                        className={styles.input}
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="student">Aluno</option>
                        <option value="professor">Professor</option>
                        <option value="admin">Administrador (Teste)</option>
                    </select>
                </div>

                <button type="submit" className={styles.button}>
                    Cadastrar
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                    Já tem conta? <Link href="/login" style={{ color: 'var(--primary-blue)' }}>Entrar</Link>
                </p>
            </form>
        </div>
    );
}
