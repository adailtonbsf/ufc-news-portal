import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import Hero from '@/components/Home/Hero';
import NewsCard from '@/components/Shared/NewsCard';
import styles from './page.module.css';

// Force dynamic rendering to fetch fresh data on every request
export const dynamic = 'force-dynamic';

async function getHomeData() {
    await dbConnect();

    const publishedQuery = {
        $or: [{ status: 'published' }, { status: { $exists: false } }]
    };

    // 1. Try to find explicitly featured news
    let featured = await News.findOne({
        ...publishedQuery,
        featured: true
    }).sort({ publishDate: -1 }).lean();

    // 2. If no featured news, fallback to latest published
    if (!featured) {
        featured = await News.findOne(publishedQuery).sort({ publishDate: -1 }).lean();
    }

    // 3. Fetch grid news (exclude featured)
    const gridQuery = {
        ...publishedQuery,
        ...(featured ? { _id: { $ne: featured._id } } : {})
    };

    const newsList = await News.find(gridQuery)
        .sort({ publishDate: -1 })
        .limit(6)
        .lean();

    const serialize = (item) => ({
        ...item,
        _id: item._id.toString(),
        publishDate: item.publishDate.toISOString(),
    });

    return {
        featured: featured ? serialize(featured) : null,
        newsList: newsList.map(serialize)
    };
}

export default async function Home() {
    const { featured, newsList } = await getHomeData();

    return (
        <div className="container">
            <Hero news={featured} />

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
