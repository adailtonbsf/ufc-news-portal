'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminDashboard() {
    const [newsList, setNewsList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Check auth
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            router.push('/login');
            return;
        }
        fetchNews();
    }, [router]);

    const fetchNews = async () => {
        const res = await fetch('/api/news');
        const data = await res.json();
        setNewsList(data);
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja apagar esta notícia?')) return;

        await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
        fetchNews(); // Refresh list
    };

    return (
        <div className={`container ${styles.adminContainer}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>Painel de Gestão</h1>
                <Link href="/admin/nova" className={styles.createButton}>
                    + Nova Notícia
                </Link>
            </div>

            <div className={`glass-card ${styles.tableContainer}`}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Data</th>
                            <th>Autor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsList.map((news) => (
                            <tr key={news._id}>
                                <td>{news.title}</td>
                                <td>{new Date(news.publishDate).toLocaleDateString('pt-BR')}</td>
                                <td>{news.author}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(news._id)}
                                        className={styles.actionButton}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
