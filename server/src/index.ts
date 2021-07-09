import { ApolloServer, gql, IResolvers } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import { PrismaSelect } from '@paljs/plugins';

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String
    published: Boolean!
    authorId: Int!
    createdAt: String!
    updatedAt: String!
  }

  input AddPostInput {
    title: String!
    content: String
    published: Boolean!
    authorId: Int!
  }

  type Profile {
    id: ID
    bio: String
    userId: Int
  }

  type User {
    id: ID!
    email: String!
    name: String!
    posts: [Post]
    profile: Profile
  }

  input AddUserInput {
    email: String!
    name: String!
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    addUser(addUserInput: AddUserInput!): User
    addPost(addPostInput: AddPostInput!): Post
    editPost(postId: ID!, addPostInput: AddPostInput): Post
    deletePost(postId: ID!): User
  }
`;

const resolvers: IResolvers<any, { readonly prismaClient: PrismaClient }> = {
  Query: {
    post(_root, { id }: { readonly id: string }, ctx, info) {
      const idn = Number(id);
      const select = new PrismaSelect(info);
      return ctx.prismaClient.post.findUnique({
        ...select.value,
        where: {
          id: idn
        }
      })
    },
    posts(_root, _argx, ctx, info) {
      const select = new PrismaSelect(info);
      return ctx.prismaClient.post.findMany({
        ...select.value
      });
    },
    user(_root, { id }: { readonly id: string }, ctx, info) {
      const idn = Number(id);
      const select = new PrismaSelect(info);
      return ctx.prismaClient.user.findUnique({
        ...select.value,
        where: {
          id: idn
        }
      })
    },
    users(_root, _argx, ctx, info) {
      const select = new PrismaSelect(info);
      return ctx.prismaClient.user.findMany({
        ...select.value
      });
    },
  },
  Mutation: {
    async addUser(
      _root,
      {
        addUserInput: {
          email,
          name
        }
      }: {
        readonly addUserInput: {
          readonly email: string;
          readonly name: string;
        }
      },
      ctx
    ) {
      const user = await ctx.prismaClient.user.findUnique({
        where: {
          email: email
        }
      });
      if (user) return null;

      const newUser = await ctx.prismaClient.user.create({
        data: {
          email,
          name
        }
      });
      return newUser;
    },
    async addPost(
      _root,
      {
        addPostInput: {
          title,
          content,
          published,
          authorId
        }
      }: {
        readonly addPostInput: {
          readonly title: string;
          readonly content?: string
          readonly published: boolean
          readonly authorId: number
        };
      },
      ctx
    ) {
      const post = await ctx.prismaClient.post.create({
        data: {
          title,
          content,
          published,
          authorId
        }
      });
      return post;
    },
    async editPost(
      _root,
      {
        postId,
        addPostInput: {
          title,
          content,
          published,
          authorId
        }
      }: {
        readonly postId: number;
        readonly addPostInput: {
          readonly title: string;
          readonly content?: string
          readonly published: boolean
          readonly authorId: number
        };
      },
      ctx
    ) {
      const post = await ctx.prismaClient.post.findUnique({
        where: {
          id: postId
        }
      });
      if (!post) return;
      await ctx.prismaClient.post.update({
        where: {
          id: postId,
        },
        data: {
          ...post,
          title,
          content,
          published,
          authorId
        }
      });
    },
    async deletePost(
      _root,
      { postId }: { readonly postId: number },
      ctx
    ) {
      await ctx.prismaClient.post.delete({
        where: {
          id: postId
        }
      });
      return postId
    }
  }
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