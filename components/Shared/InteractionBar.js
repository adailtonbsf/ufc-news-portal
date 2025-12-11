'use client';

import { useState, useEffect } from 'react';
import styles from './InteractionBar.module.css';

const InteractionBar = ({ newsId, initialLikes = 0, comments = 0 }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check local storage on mount to see if already liked this specific news
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        if (likedPosts.includes(newsId)) {
            setHasLiked(true);
        }
    }, [newsId]);

    const handleLike = async () => {
        if (isLoading) return;

        const action = hasLiked ? 'remove' : 'add';
        const newCount = hasLiked ? likes - 1 : likes + 1;

        // Optimistic API Update
        setLikes(newCount);
        setHasLiked(!hasLiked);
        setIsLoading(true);

        try {
            await fetch(`/api/news/like?id=${newsId}&action=${action}`, { method: 'PATCH' });

            // Update Local Storage
            const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
            if (action === 'add') {
                if (!likedPosts.includes(newsId)) {
                    likedPosts.push(newsId);
                    localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
                }
            } else {
                const newLikedPosts = likedPosts.filter(id => id !== newsId);
                localStorage.setItem('liked_posts', JSON.stringify(newLikedPosts));
            }

        } catch (error) {
            // Revert if failed
            setLikes(likes);
            setHasLiked(hasLiked);
        } finally {
            setIsLoading(false);
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

            <button className={styles.action}>
                🔗 <span className={styles.label}>Compartilhar</span>
            </button>
        </div>
    );
};

export default InteractionBar;
