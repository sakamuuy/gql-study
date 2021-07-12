import { objectType, arg, nonNull, idArg, inputObjectType, enumType, scalarType, makeSchema } from 'nexus';

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("addUser", {
      type: User,
      args: {
        addUserInput: arg({ type: nonNull(AddUserInput) }),
      },
    })
    t.field("addPost", {
      type: Post,
      args: {
        addPostInput: arg({ type: nonNull(AddPostInput) }),
      },
    })
    t.field("editPost", {
      type: Post,
      args: {
        postId: nonNull(idArg()),
        addPostInput: arg({ type: AddPostInput }),
      },
    })
    t.field("deletePost", {
      type: User,
      args: {
        postId: nonNull(idArg()),
      },
    })
  }
})
const Post = objectType({
  name: "Post",
  definition(t) {
    t.nonNull.id("id")
    t.nonNull.string("title")
    t.string("content")
    t.nonNull.boolean("published")
    t.nonNull.int("authorId")
    t.nonNull.string("createdAt")
    t.nonNull.string("updatedAt")
  }
})
const Profile = objectType({
  name: "Profile",
  definition(t) {
    t.id("id")
    t.string("bio")
    t.int("userId")
  }
})
const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("posts", { type: Post })
    t.field("post", {
      type: Post,
      args: {
        id: nonNull(idArg()),
      },
    })
    t.nonNull.list.nonNull.field("users", { type: User })
    t.field("user", {
      type: User,
      args: {
        id: nonNull(idArg()),
      },
    })
  }
})
const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id")
    t.nonNull.string("email")
    t.nonNull.string("name")
    t.list.field("posts", { type: Post })
    t.field("profile", { type: Profile })
  }
})

const AddPostInput = inputObjectType({
  name: "AddPostInput",
  definition(t) {
    t.nonNull.string("title")
    t.string("content")
    t.nonNull.boolean("published")
    t.nonNull.int("authorId")
  }
});
const AddUserInput = inputObjectType({
  name: "AddUserInput",
  definition(t) {
    t.nonNull.string("email")
    t.nonNull.string("name")
  }
});

const CacheControlScope = enumType({
  name: "CacheControlScope",
  members: ['PUBLIC','PRIVATE'],
});

const Upload = scalarType({
  name: "Upload",
  serialize() { /* Todo */ },
  parseValue() { /* Todo */ },
  parseLiteral() { /* Todo */ }
});

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Post,
    User,
  ],
  outputs: {
    schema: __dirname + '/schema.graphql',
    typegen: __dirname + '/server/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})