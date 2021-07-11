import { VFC } from 'react'
import { PostQuery, PostQueryVariables } from './__generated__/post-query'
import { PostsQuery, PostsQueryVariables } from '../../components/PostList/__generated__/posts-query';
import { UserQuery, UserQueryVariables } from './__generated__/user-query';
import { request, gql } from 'graphql-request';

const gqlServer = process.env.GRAPHQL_SERVER? 
  process.env.GRAPHQL_SERVER : 'http://localhost:4000/';

const USER_QUERY = gql`
  query UserQuery($id:ID!) {
    user(id:$id) {
      name
    }
  }
`;

const POST_QUERY = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      id
      title
      content
      authorId
    }
  }
`;

const POSTS_QUERY = gql`
  query PostsQuery {
    posts {
      id
    }
  }
`;

type Props = {
  post: PostQuery,
  user: UserQuery
};

const Post: VFC<Props> = ({ post, user }) => {

  return (<div>
    <h1>{post?.post?.title}</h1>
    <p>{post?.post?.content}</p>
    {user.user?.name}
  </div>);
};

export async function getStaticPaths() {
  const data = await request<PostsQuery, PostsQueryVariables>(gqlServer, POSTS_QUERY);

  return {
    paths: data?.posts.map((p) => `/posts/${p.id}`),
    fallback: false
  }
};

export async function getStaticProps({ params }: { params: { id: string }}) {
  const post = await request<PostQuery, PostQueryVariables>(gqlServer, POST_QUERY, {
    id: params.id
  });

  const uid = post.post?.authorId;

  if (!uid) return null;

  const user = await request<UserQuery, UserQueryVariables>(gqlServer, USER_QUERY, {
    id: uid + ''
  });

  return {
    props: {
      post,
      user
    }
  }
}

export default Post