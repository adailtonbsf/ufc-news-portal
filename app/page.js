import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import Hero from '@/components/Home/Hero';
import NewsCard from '@/components/Shared/NewsCard';
import styles from './page.module.css';

// Force dynamic rendering to fetch fresh data on every request
export const dynamic = 'force-dynamic';

async function getNews() {
    await dbConnect();
    // Fetch latest 6 news, sorted by date desc
    const news = await News.find({}).sort({ publishDate: -1 }).limit(6).lean();

    // Convert _id and dates to string to avoid serialization issues
    return news.map(item => ({
        ...item,
        _id: item._id.toString(),
        publishDate: item.publishDate.toISOString(),
    }));
}

export default async function Home() {
    const newsList = await getNews();

    return (
        <div className="container">
            <Hero />

            <section className={styles.newsSection}>
                <h2 className={styles.sectionTitle}>Últimas Notícias</h2>
                <div className={styles.grid}>
                    {newsList.map((news) => (
                        <NewsCard key={news._id} news={news} />
                    ))}
                </div>
            </section>
        </div>
    );
}
