import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.content}`}>
                <p className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Universidade Federal do Ceará.
                </p>
                <div className={styles.socials}>
                    <span>Instagram</span>
                    <span>Twitter</span>
                    <span>Facebook</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
