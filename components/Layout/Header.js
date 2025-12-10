import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={`${styles.header} glass`}>
            <div className={`container ${styles.nav}`}>
                <Link href="/" className={styles.logo}>
                    Jornal da <span>UFC</span>
                </Link>

                <ul className={styles.links}>
                    <li><Link href="/" className={styles.link}>Home</Link></li>
                    <li><Link href="/eventos" className={styles.link}>Eventos</Link></li>
                    <li><Link href="/pesquisa" className={styles.link}>Pesquisa</Link></li>
                    <li><Link href="/extensao" className={styles.link}>Extensão</Link></li>
                    <li><Link href="/editais" className={styles.link}>Editais</Link></li>
                </ul>

                <div className={styles.actions}>
                    <button className={styles.searchBtn} aria-label="Buscar">
                        🔍
                    </button>
                    <div className={styles.avatar}>U</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
