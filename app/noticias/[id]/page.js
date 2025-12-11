import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import Sidebar from '@/components/Article/Sidebar';
import InteractionBar from '@/components/Shared/InteractionBar';
import styles from './styles.module.css';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getNewsItem(id) {
    await dbConnect();
    try {
        const news = await News.findById(id).lean();
        if (!news) return null;
        return {
            ...news,
            _id: news._id.toString(),
            publishDate: news.publishDate.toISOString(),
        };
    } catch (error) {
        return null;
    }
}

export default async function NewsDetails({ params }) {
    const { id } = await params; // Await params in newer Next.js versions
    const news = await getNewsItem(id);

    if (!news) {
        notFound();
    }

    return (
        <div className="container">
            <article className={styles.articlePage}>
                <div className={styles.mainContent}>
                    <div className={styles.header}>
                        <div className={styles.meta}>
                            <span className={styles.category}>{news.category}</span>
                            <span>•</span>
                            <span>{new Date(news.publishDate).toLocaleDateString('pt-BR')}</span>
                            <span>•</span>
                            <span>{news.author}</span>
                        </div>
                        <h1 className={styles.title}>{news.title}</h1>
                        <p className={styles.subtitle}>{news.subtitle}</p>
                    </div>

                    <img src={news.imageUrl} alt={news.title} className={styles.coverImage} />

                    <InteractionBar newsId={news._id} initialLikes={news.likes} comments={12} />

                    <div className={styles.body}>
                        {/* Simple paragraph splitting for Sprint 1 */}
                        {news.content.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                <Sidebar />
            </article>
        </div>
    );
}
