import { VFC, ReactChild } from 'react'
import styles from './listItem.module.css';

const ListItem: VFC<{children: ReactChild}> = ({ children }) => {
  return <div className={styles.listItem}>{children}</div>
};

export default ListItem;