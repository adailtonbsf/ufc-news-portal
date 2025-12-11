'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import NewsCard from '@/components/Shared/NewsCard';
import styles from '../page.module.css'; // Reusing home styles

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/news'); // Fetch all for now and filter client-side for simple prototype
                const data = await res.json();

                if (query) {
                    // Simple case-insensitive filtering
                    const lowerQuery = query.toLowerCase();
                    const filtered = data.filter(news =>
                        news.title.toLowerCase().includes(lowerQuery) ||
                        news.content.toLowerCase().includes(lowerQuery) ||
                        news.category.toLowerCase().includes(lowerQuery)
                    );
                    setResults(filtered);
                } else {
                    setResults([]);
                }

            } catch (error) {
                console.error('Search failed');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        } else {
            setLoading(false);
        }
    }, [query]);

    return (
        <>
            <h1 style={{ margin: '2rem 1rem', fontSize: '1.8rem', color: 'var(--primary-blue)' }}>
                Resultados para: "{query}"
            </h1>

            {loading ? (
                <p style={{ margin: '1rem' }}>Buscando...</p>
            ) : results.length > 0 ? (
                <div className={styles.grid}>
                    {results.map((news) => (
                        <NewsCard key={news._id} news={news} />
                    ))}
                </div>
            ) : (
                <p style={{ margin: '1rem', color: '#666' }}>Nenhuma notícia encontrada.</p>
            )}
        </>
    );
}

export default function SearchPage() {
    return (
        <main className={styles.main}>
            <Suspense fallback={<p style={{ margin: '2rem' }}>Carregando busca...</p>}>
                <SearchContent />
            </Suspense>
        </main>
    );
}
