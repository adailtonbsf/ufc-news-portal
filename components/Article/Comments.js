'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Comments.module.css';

export default function Comments({ newsId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for logged user
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Fetch comments
        fetchComments();
    }, [newsId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?newsId=${newsId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newsId,
                    userId: user.email, // using email as ID for now
                    userName: user.name,
                    content: newComment
                })
            });

            if (res.ok) {
                setNewComment('');
                fetchComments(); // Reload comments
            } else {
                alert('Erro ao enviar comentário.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao enviar comentário.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div>Carregando comentários...</div>;

    return (
        <section className={styles.commentsSection}>
            <h3 className={styles.title}>Comentários ({comments.length})</h3>

            {!user ? (
                <div className={styles.loginPrompt}>
                    Você precisa estar <Link href="/login" className={styles.loginLink}>logado</Link> para comentar.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <textarea
                        className={styles.textarea}
                        placeholder="Escreva seu comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                        maxLength={500}
                    />
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting || !newComment.trim()}
                    >
                        {isSubmitting ? 'Enviando...' : 'Publicar Comentário'}
                    </button>
                </form>
            )}

            <div className={styles.commentsList}>
                {comments.length === 0 ? (
                    <p className={styles.emptyState}>Seja o primeiro a comentar!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <span className={styles.author}>{comment.userName}</span>
                                <span className={styles.date}>
                                    {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <p className={styles.content}>{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
