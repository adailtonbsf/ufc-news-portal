import Link from 'next/link';
import styles from './Sidebar.module.css';

const Sidebar = ({ newsList = [] }) => {
    return (
        <aside className={styles.sidebar}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 className={styles.sectionTitle}>Outras Notícias</h3>
                <div className={styles.list}>
                    {newsList.length > 0 ? newsList.map((news) => (
                        <Link href={`/noticias/${news._id}`} key={news._id} className={styles.item}>
                            <img src={news.imageUrl} alt={news.title} className={styles.image} referrerPolicy="no-referrer" />
                            <div className={styles.itemContent}>
                                <h4 className={styles.itemTitle}>{news.title}</h4>
                                <span className={styles.itemDate}>{new Date(news.publishDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </Link>
                    )) : (
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Nenhuma outra notícia recente.</p>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
