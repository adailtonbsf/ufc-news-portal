import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import NewsCard from '@/components/Shared/NewsCard';
import styles from '@/app/page.module.css';

// Reusing Home styles
export default async function CategoryPage(props) {
    const params = await props.params;
    await dbConnect();

    // Case-insensitive regex for category matching (Decode params first)
    const categorySlug = decodeURIComponent(params.slug);
    const newsList = await News.find({
        category: { $regex: new RegExp(categorySlug, "i") }
    }).sort({ publishDate: -1 });

    return (
        <main className={styles.main}>
            <div style={{
                background: 'var(--primary-blue)',
                color: 'white',
                padding: '3rem 1rem',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '2.5rem', textTransform: 'capitalize' }}>{categorySlug}</h1>
                <p>Todas as notícias de {categorySlug}</p>
            </div>

            <div className={styles.grid}>
                {newsList.length > 0 ? (
                    newsList.map(news => (
                        <NewsCard key={news._id} news={news} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', width: '100%', color: '#666' }}>
                        Ainda não há notícias nesta categoria.
                    </p>
                )}
            </div>
        </main>
    );
}
