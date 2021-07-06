import { ApolloServer, gql, IResolvers } from 'apollo-server';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaSelect } from '@paljs/plugins';

const typeDefs = gql`
  type Post {
    id: ID
    title: String 
    content: String
    published: Boolean
    authorId: Int
  }

  type Profile {
    id: ID
    bio: String
    userId: Int
  }

  type User {
    id: ID
    email: String
    name: String
    posts: [Post!]!
    profile: Profile
  }
`;

const resolvers: IResolvers<any, { readonly prismaClient: PrismaClient }> = {
  Query: {
    post(_root, { id }: { readonly id: string }, ctx, info) {
      const select = new PrismaSelect(info);
    }
  },
};

class PrismaClientPool {
  private client: PrismaClient;
  constructor() {
    this.client = new PrismaClient({
      log: ["query", "info", "warn", "error"]
    });
  }
  getClient() {
    return this.client;
  }
}

const clientPool = new PrismaClientPool();

const server = new ApolloServer({ 
  cors: true,
  context() {
    return {
      prismaClient: clientPool.getClient()
    };
  },
  typeDefs, 
  resolvers 
});

server.listen().then(({ url }: { url: string }) => {
  console.log(`🚀  Server ready at ${url}`);
});