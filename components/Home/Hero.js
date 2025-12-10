import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={`container ${styles.content}`}>
        <span className={styles.badge}>Destaque da Semana</span>
        <h1 className={styles.title}>
          UFC Expandindo Fronteiras: Novos Campi Confirmados
        </h1>
        <p className={styles.description}>
          O Conselho Universitário aprovou a criação de dois novos campi no interior, 
          ampliando o acesso ao ensino superior de qualidade para mais de 5 mil estudantes.
        </p>
        <Link href="/noticias/destaque-campi" className={styles.ctaButton}>
          Leia a Matéria Completa →
        </Link>
      </div>
    </section>
  );
};

export default Hero;
