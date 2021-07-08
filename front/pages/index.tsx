import Header from '../components/Header'
import PostList from '../components/PostList';
import { 
  ApolloClient,
  InMemoryCache,
  ApolloProvider 
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
})

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <div>
        <Header />
        <PostList />
      </div>
    </ApolloProvider>
  )
}
