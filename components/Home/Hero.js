import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      {/* Background Image - Placeholder from Unsplash */}
      <img
        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
        alt="Campus da Universidade"
        className={styles.image}
      />

      <div className={styles.overlay} />

      <div className={styles.heroContent}>
        <span className={styles.badge}>Destaque da Semana</span>
        <h1 className={styles.title}>Universidade Inaugura Novo Centro de Inovação</h1>
        <p className={styles.subtitle}>
          Espaço colaborativo visa integrar alunos, professores e empresas para o desenvolvimento de soluções tecnológicas.
        </p>
        <Link href="/noticias/destaque" className={styles.ctaButton}>
          Leia a Matéria Completa
        </Link>
      </div>
    </section>
  );
};

export default Hero;
