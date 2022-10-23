import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";

//Objecttype is used to create a type
export const Link = objectType({
  name: "Link", //Name of the type
  definition(t) { //Different fields that gets added to the type
    t.nonNull.int("id"); //This adds a field named id of type Int
    t.nonNull.string("description"); //This adds a field named description of type String
    t.nonNull.string("url"); //This adds a field named url of type String
    t.field("postedBy", {   // 1
      type: "User",
      resolve(parent, args, context) {  // 2
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
  }
});

export const LinksQuery = extendType({  // You are extending the Query root type and adding a new root field to it called feed.
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {   //You define the return type of the feed query as a not nullable array of link type objects (In the SDL the return type will look like this: [Link!]!).
      type: "Link",
      resolve(parent, args, context, info) {
        return context.prisma.link.findMany();
      },
    });
  },
});

//You’re extending the Mutation type to add a new root field. You did something similar in the last chapter with the Query type.
export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", { //The name of the mutation is defined as post and it returns a (non nullable) link object.
      type: "Link",
      args: {  //Here you define the arguments to your mutation. You can pass arguments to your GraphQL API endpoints (just like in REST). In this case, the two arguments you need to pass are description and url. Both arguments mandatory (hence the nonNull()) because both are needed to create a new link.
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { description, url } = args;
        const { userId } = context;

        if (!userId) {  // 1
          throw new Error("Cannot post without logging in.");
        }

        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } },  // 2
          },
        });

        return newLink;
      }
    });
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("link", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },

      resolve(parent, args, context) {
        const link = context.prisma.link.findUnique({
          where: {
            id: args.id
          }
        });
        return link;
      }
    })
  }
});

export const LinkUpdateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const updatedLink = context.prisma.link.update({
          where: {
            id: args.id
          },
          data: {
            description: args.description,
            url: args.url
          }
        });
        return updatedLink;
      },
    });
  },
});

export const LinkDeleteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: {
        id: nonNull(intArg())
      },

      resolve(parent, args, context) {
        const deletedLink = context.prisma.link.delete({
          where: {
            id: args.id
          }
        })
        return deletedLink;
      },
    });
  },
});