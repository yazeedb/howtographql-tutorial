const { GraphQLServer } = require('graphql-yoga');
const { find, merge, pick, pipe, propEq, when } = require('ramda');
let links = require('./links.json');

const idEq = propEq('id');
const doIfMatchingId = (id) => when(idEq(id));

const resolvers = {
  Query: {
    links: () => links,
    link: (root, { id }) => find(idEq(id), links)
  },
  Mutation: {
    post: (root, args) => pipe(
      pick(['url', 'description']),
      merge({ id: `link-${links.length}` }),
      (link) => {
        // OMG side-effect! O_o"
        links.push(link);

        return link;
      }
    )(args),
    updateLink: (root, args) => {
      let newLink;

      links = links.map(
        doIfMatchingId((link) => {
          newLink = merge(link, args);
          return newLink;
        })
      );

      return newLink;
    },
    deleteLink: (root, { id }) => {
      let linkToDelete;

      links.forEach((link, index) => {
        const matchAndRemove = (match) => {
          linkToDelete = match;
          links.splice(index, 1);
        };

        return doIfMatchingId(id)(matchAndRemove, link);
      });

      return linkToDelete;
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
