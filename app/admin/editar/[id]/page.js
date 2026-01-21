'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/Shared/Auth.module.css';
import ImageUpload from '@/components/ImageUpload';

export default function EditNewsPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        category: 'Geral',
        imageUrl: '',
        content: '',
        author: '',
        status: 'draft'
    });

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`/api/news?id=${id}`);
                if (!res.ok) throw new Error('Falha ao carregar notícia');
                const data = await res.json();
                setFormData({
                    title: data.title || '',
                    subtitle: data.subtitle || '',
                    category: data.category || 'Geral',
                    imageUrl: data.imageUrl || '',
                    content: data.content || '',
                    author: data.author || '',
                    status: data.status || 'draft'
                });
            } catch (error) {
                alert(error.message);
                router.push('/admin');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [id, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/news', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...formData }),
            });

            if (res.ok) {
                alert('Notícia atualizada com sucesso!');
                router.push('/admin');
                router.refresh();
            } else {
                alert('Erro ao atualizar notícia.');
            }
        } catch (error) {
            alert('Erro de conexão.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Carregando dados da notícia...</div>;

    return (
        <div className={styles.container} style={{ minHeight: 'auto', padding: '2rem' }}>
            <form onSubmit={handleSubmit} className={`glass-card ${styles.card}`} style={{ maxWidth: '800px' }}>
                <h1 className={styles.title}>Editar Notícia</h1>

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
                    <label className={styles.label}>Imagem de Capa</label>
                    <ImageUpload
                        currentImage={formData.imageUrl}
                        onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
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

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Status</label>
                    <select
                        className={styles.input}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                    </select>
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
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form >
        </div >
    );
}
