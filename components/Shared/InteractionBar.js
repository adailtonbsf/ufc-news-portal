'use client';

import { useState, useEffect } from 'react';
import styles from './InteractionBar.module.css';

const InteractionBar = ({ newsId, initialLikes = 0, comments = 0 }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkLikeStatus = async () => {
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const { email } = JSON.parse(userData);

            try {
                // Check status from server to ensure cross-device persistence
                const res = await fetch(`/api/news/like?id=${newsId}&userEmail=${email}`);
                if (res.ok) {
                    const data = await res.json();
                    setHasLiked(data.hasLiked);
                }
            } catch (error) {
                console.error('Failed to check like status');
            }
        };

        checkLikeStatus();
    }, [newsId]);

    const handleLike = async () => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert('Você precisa estar logado para curtir!');
            return;
        }

        if (isLoading) return;

        const { email } = JSON.parse(userData);

        // Optimistic UI update
        const previousLikes = likes;
        const previousHasLiked = hasLiked;

        setHasLiked(!hasLiked);
        setLikes(hasLiked ? likes - 1 : likes + 1);
        setIsLoading(true);

        try {
            const res = await fetch(`/api/news/like?id=${newsId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: email })
            });

            if (!res.ok) throw new Error('Failed');

            const data = await res.json();
            setLikes(data.likes);
            setHasLiked(data.hasLiked);
        } catch (error) {
            // Revert on failure
            setLikes(previousLikes);
            setHasLiked(previousHasLiked);
            alert('Erro ao computar curtida.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Jornal da UFC',
            text: 'Confira esta notícia!',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copiado para a área de transferência!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className={styles.bar}>
            <button
                className={`${styles.action} ${hasLiked ? styles.liked : ''}`}
                onClick={handleLike}
                title={hasLiked ? "Remover curtida" : "Curtir"}
            >
                ❤️ <span className={styles.label}>{likes} Curtidas</span>
            </button>

            <button className={styles.action}>
                💬 <span className={styles.label}>{comments} Comentários</span>
            </button>

            <button className={styles.action} onClick={handleShare}>
                🔗 <span className={styles.label}>Compartilhar</span>
            </button>
        </div>
    );
};

export default InteractionBar;
