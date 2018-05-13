const { GraphQLServer } = require('graphql-yoga');
let links = require('./links.json');

const resolvers = {
  Query: {
    links: () => links
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(() => console.log('Running on port 4000'));
