const { GraphQLServer } = require('graphql-yoga');
const links = require('./links.json');

const resolvers = {
  Query: {
    info: () => 'This is the Hackernews Clone API',
    feed: () => links,
    link: (root, { id }) => links.find((link) => link.id === id)
  },
  Mutation: {
    post: (root, { description, url }) => {
      const link = {
        id: `link-${links.length}`,
        description,
        url
      }

      links.push(link);

      return link;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(() => console.log('Running on port 4000'))
