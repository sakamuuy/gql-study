import styles from './header.module.css';
import SecondaryButton from '../atoms/Button/SecButton';

export default function Header() {
  return (
    <header className={styles.header}>
      <h2>log</h2>
      <SecondaryButton>
         login
      </SecondaryButton>
    </header>
  )
}