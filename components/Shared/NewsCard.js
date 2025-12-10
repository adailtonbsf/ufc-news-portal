import Link from 'next/link';
import styles from './NewsCard.module.css';

const NewsCard = ({ news }) => {
    return (
        <Link href={`/noticias/${news._id}`} className={`glass-card ${styles.card}`}>
            <div className={styles.imageContainer}>
                <span className={styles.category}>{news.category}</span>
                <img src={news.imageUrl} alt={news.title} className={styles.image} />
            </div>

            <div className={styles.content}>
                <span className={styles.date}>
                    {new Date(news.publishDate).toLocaleDateString('pt-BR')}
                </span>
                <h3 className={styles.title}>{news.title}</h3>
                <p className={styles.subtitle}>{news.subtitle}</p>

                <div className={styles.footer}>
                    <span className={styles.author}>{news.author}</span>
                    <span className={styles.likes}>❤️ {news.likes}</span>
                </div>
            </div>
        </Link>
    );
};

export default NewsCard;
