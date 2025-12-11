'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/Shared/Auth.module.css'; // Reusing efficient forms style

export default function NewNewsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        category: 'Geral',
        imageUrl: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=800&q=80',
        content: '',
        author: 'Admin'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Notícia publicada com sucesso!');
                router.push('/admin'); // Go back to dashboard
                router.refresh();
            } else {
                alert('Erro ao publicar. Verifique os dados.');
            }
        } catch (error) {
            alert('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container} style={{ minHeight: 'auto', padding: '2rem' }}>
            <form onSubmit={handleSubmit} className={`glass-card ${styles.card}`} style={{ maxWidth: '800px' }}>
                <h1 className={styles.title}>Nova Notícia</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Título</label>
                        <input
                            required
                            className={styles.input}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Categoria</label>
                        <select
                            className={styles.input}
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Geral">Geral</option>
                            <option value="Eventos">Eventos</option>
                            <option value="Pesquisa">Pesquisa</option>
                            <option value="Extensão">Extensão</option>
                            <option value="Editais">Editais</option>
                        </select>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Subtítulo (Resumo)</label>
                    <input
                        className={styles.input}
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>URL da Imagem (Capa)</label>
                    <input
                        className={styles.input}
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Conteúdo da Matéria</label>
                    <textarea
                        required
                        className={styles.input}
                        style={{ minHeight: '200px', resize: 'vertical' }}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Escreva aqui o texto completo..."
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Autor</label>
                    <input
                        className={styles.input}
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className={styles.button}
                        style={{ background: '#6b7280' }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Publicando...' : 'Publicar Notícia'}
                    </button>
                </div>

            </form>
        </div>
    );
}
