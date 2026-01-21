import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = ({ news }) => {
  if (!news) return null; // Or return a default placeholder if desired

  return (
    <section className={styles.hero}>
      {/* Background Image */}
      <img
        src={news.imageUrl}
        alt={news.title}
        className={styles.image}
        referrerPolicy="no-referrer"
      />

      <div className={styles.overlay} />

      <div className={styles.heroContent}>
        <span className={styles.badge}>Destaque da Semana</span>
        <h1 className={styles.title}>{news.title}</h1>
        <p className={styles.subtitle}>
          {news.subtitle}
        </p>
        <Link href={`/noticias/${news._id}`} className={styles.ctaButton}>
          Leia a Matéria Completa
        </Link>
      </div>
    </section>
  );
};

export default Hero;
