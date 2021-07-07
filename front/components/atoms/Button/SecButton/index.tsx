import { ReactChild, VFC } from "react"
import styles from './secButton.module.css';

const SecondaryButton: VFC<{children: ReactChild}> = ({ children}) => {
  return (
    <button className={styles.secondaryButton}>{children}</button>
  )
}

export default SecondaryButton;