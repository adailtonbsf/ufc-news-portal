'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminDashboard() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
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
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            // If not admin, filter by my email
            const query = user.role !== 'admin' ? `?authorEmail=${user.email}` : '';

            const res = await fetch(`/api/news${query}`);
            const data = await res.json();
            setNewsList(data);
        } catch (error) {
            console.error('Failed to fetch news', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja apagar esta notícia?')) return;

        await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
        fetchNews(); // Refresh list
    };

    const handleToggleStatus = async (news) => {
        const newStatus = news.status === 'published' ? 'draft' : 'published';

        const res = await fetch('/api/news', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: news._id, status: newStatus }),
        });

        if (res.ok) {
            fetchNews();
        } else {
            alert('Erro ao atualizar status');
        }
    };

    const handleToggleFeatured = async (news) => {
        const newFeatured = !news.featured;

        const res = await fetch('/api/news', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: news._id, featured: newFeatured }),
        });

        if (res.ok) {
            fetchNews();
        } else {
            alert('Erro ao atualizar destaque');
        }
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
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        Carregando notícias...
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Data</th>
                                <th>Autor</th>
                                <th>Destaque</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsList.map((news) => (
                                <tr key={news._id}>
                                    <td>{news.title}</td>
                                    <td>{new Date(news.publishDate).toLocaleDateString('pt-BR')}</td>
                                    <td>{news.author}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleToggleFeatured(news)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '1.2rem',
                                                cursor: 'pointer',
                                                filter: news.featured ? 'none' : 'grayscale(100%)',
                                                opacity: news.featured ? 1 : 0.3
                                            }}
                                            title={news.featured ? 'Remover destaque' : 'Destacar'}
                                        >
                                            ⭐
                                        </button>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: news.status === 'published' ? '#d4edda' : '#fff3cd',
                                            color: news.status === 'published' ? '#155724' : '#856404',
                                            fontSize: '0.85rem'
                                        }}>
                                            {news.status === 'published' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actionsCell}>
                                            <button
                                                onClick={() => handleToggleStatus(news)}
                                                className={styles.actionButton}
                                                style={{ backgroundColor: news.status === 'published' ? '#ffc107' : '#28a745' }}
                                            >
                                                {news.status === 'published' ? 'Despublicar' : 'Publicar'}
                                            </button>
                                            <Link
                                                href={`/admin/editar/${news._id}`}
                                                className={styles.actionButton}
                                            >
                                                Editar
                                            </Link>
                                            <Link
                                                href={`/noticias/${news._id}`}
                                                className={styles.actionButton}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Ver no site"
                                            >
                                                Ver 🔗
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(news._id)}
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
