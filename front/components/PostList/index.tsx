import { VFC } from 'react';
import ListItem from '../atoms/ListItem';
import styles from './postList.module.css'

const PostList = () => {
  return (
    <ul className={styles.postList}>
      {[0,1,2,3,4].map((i) => (
        <li key={i} className={styles.postListItem}>
          <ListItem>
            <>
              <h4 className={styles.postListItem__title}>title</h4>
              <p className={styles.postListItem__body}>テキストテキストテキストテキストテキストテキストテキストテトテキストテキスト
              テキストテキストテキストテキストテキストテキストテキストテトテキストテキスト
              テキストテキストテキストテキストテキストテキストテキストテトテキストテキスト
              </p>
            </>
          </ListItem>
        </li>
      ))
      }
    </ul>
  )
};

export default PostList;