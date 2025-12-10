import styles from './InteractionBar.module.css';

const InteractionBar = ({ likes = 0, comments = 0 }) => {
    return (
        <div className={styles.bar}>
            <button className={`${styles.action} ${styles.liked}`}>
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
