import { VFC } from 'react'
// import { gql, useQuery, ApolloError } from '@apollo/client';
import { PostQuery, PostQueryVariables } from './__generated__/post-query'
import { PostsQuery, PostsQueryVariables } from '../../components/PostList/__generated__/posts-query';
import { request, gql } from 'graphql-request';

const POST_QUERY = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      id
      title
      content
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
  // loading: boolean
  // error: ApolloError
  data: any
};

const Post: VFC<Props> = ({ data }) => {

  // if (loading) return <div>loading...</div>
  // if (error) return <div>Error</div>

  return (<div>
    <h1>{data?.post?.title}</h1>
    <p>{data?.post?.content}</p>
  </div>);
};

export async function getStaticPaths() {
  const data = await request('http://localhost:4000/', POSTS_QUERY);
  // const { data } = useQuery<PostsQuery, PostsQueryVariables>(POSTS_QUERY);
  return {
    paths: data?.posts.map((p: { id: string }) => `/posts/${p.id}`),
    fallback: false
  }
};

export async function getStaticProps({ params }: { params: { id: string }}) {
  const data = await request('http://localhost:4000/', POST_QUERY, {
    id: params.id
  });
  // const { loading, error, data } = useQuery<PostQuery, PostQueryVariables>(POST_QUERY, {
  //   variables: {
  //     id: params.id
  //   }
  // });

  return {
    props: {
      data
    }
  }
}

export default Post