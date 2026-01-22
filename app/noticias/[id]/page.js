import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import Comment from '@/models/Comment';
import Sidebar from '@/components/Article/Sidebar';
import Comments from '@/components/Article/Comments';
import InteractionBar from '@/components/Shared/InteractionBar';
import styles from './styles.module.css';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getNewsItem(id) {
    await dbConnect();
    try {
        const news = await News.findById(id).lean();
        if (!news) return null;
        // Moderate: Hide drafts
        if (news.status && news.status !== 'published') return null;
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

    // Fetch recent news for sidebar
    const recentNews = await News.find({
        _id: { $ne: id },
        $or: [{ status: 'published' }, { status: { $exists: false } }]
    })
        .sort({ publishDate: -1 })
        .limit(3)
        .lean();

    // Fetch comment count
    const commentCount = await Comment.countDocuments({ newsId: id });

    // Serialize for props
    const serializedRecent = recentNews.map(item => ({
        ...item,
        _id: item._id.toString(),
        publishDate: item.publishDate.toISOString(),
    }));

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

                    <img src={news.imageUrl} alt={news.title} className={styles.coverImage} referrerPolicy="no-referrer" />

                    <InteractionBar newsId={news._id} initialLikes={news.likes} comments={commentCount} />

                    <div className={styles.body}>
                        {/* Simple paragraph splitting for Sprint 1 */}
                        {news.content.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                        ))}
                    </div>

                    <Comments newsId={news._id} />
                </div>

                <Sidebar newsList={serializedRecent} />
            </article>
        </div>
    );
}
