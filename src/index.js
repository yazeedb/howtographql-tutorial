const { GraphQLServer } = require('graphql-yoga');
const { always, find, propEq } = require('ramda');
const links = require('./links.json');

const resolvers = {
  Query: {
    links: always(links),
    link: (root, { id }) => find(propEq('id', id), links)
  },
  Mutation: {
    post: (root, { url, description }) => {
      const link = {
        id: `link-${links.length}`,
        url,
        description
      };

      links.push(link);

      return link;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(() => console.log('Running on port 4000'))

// const resolvers = {
//   Query: {
//     info: () => 'This is the Hackernews Clone API',
//     feed: () => links,
//     link: (root, { id }) => links.find((link) => link.id === id)
//   },
//   Mutation: {
//     post: (root, { description, url }) => {
//       const link = {
//         id: `link-${links.length}`,
//         description,
//         url
//       }
//
//       links.push(link);
//
//       return link;
//     },
//     updateLink: (root, { id, description, url }) => links.map((link) => (
//       link.id === id ? { ...link, description, url } : link
//     ))
//   }
// };
