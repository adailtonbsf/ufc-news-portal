import Link from 'next/link';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    // Static placeholder data for Sprint 1
    const relatedNews = [
        {
            id: '1',
            title: 'Festival de Cultura abre inscrições',
            date: '12/12/2025',
            image: 'https://images.unsplash.com/photo-1514525253440-b393452e3726?auto=format&fit=crop&w=150&q=80'
        },
        {
            id: '2',
            title: 'Novas regras para o restaurante universitário',
            date: '10/12/2025',
            image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=150&q=80'
        },
        {
            id: '3',
            title: 'Equipe de robótica vence competição nacional',
            date: '08/12/2025',
            image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=150&q=80'
        }
    ];

    return (
        <aside className={styles.sidebar}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 className={styles.sectionTitle}>Notícias Relacionadas</h3>
                <div className={styles.list}>
                    {relatedNews.map((news) => (
                        <Link href="#" key={news.id} className={styles.item}>
                            <img src={news.image} alt={news.title} className={styles.image} />
                            <div className={styles.itemContent}>
                                <h4 className={styles.itemTitle}>{news.title}</h4>
                                <span className={styles.itemDate}>{news.date}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
