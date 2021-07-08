import { VFC } from 'react';
import ListItem from '../atoms/ListItem';
import styles from './postList.module.css'
import { gql, useQuery } from '@apollo/client';
import { PostsQuery, PostsQueryVariables } from './__generated__/posts-query';

const POSTS_QUERY = gql`
  query PostsQuery {
    posts {
      id
      title
      content
    }
  }
`;

const PostList = () => {

  const { loading, error, data } = useQuery<PostsQuery, PostsQueryVariables>(POSTS_QUERY);

  if (loading || !data?.posts.length) return <></>;

  if (error) return <div>'error'</div>;

  return (
    <ul className={styles.postList}>
      {data.posts?.map((post) => (
        <li key={post.id} className={styles.postListItem}>
          <ListItem>
            <>
              <h4 className={styles.postListItem__title}>{post.title}</h4>
              <p className={styles.postListItem__body}>
                {post.content}
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