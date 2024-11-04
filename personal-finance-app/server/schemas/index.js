const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const createApolloServer = () => {
    return new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const token = req.headers.authorization || "";
            return { token };
        },
        introspection: true,
        playground: true,
    });
};

module.exports = createApolloServer;
