const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();
const PORT = 4000;

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello, world!",
    },
};

async function startServer() {
    try {
        const server = new ApolloServer({ typeDefs, resolvers });
        await server.start();
        server.applyMiddleware({ app });

        app.listen(PORT, () => {
            console.log(
                `Server running at http://localhost:${PORT}${server.graphqlPath}`
            );
        });
    } catch (error) {
        console.error("Error starting test server:", error);
    }
}

startServer();
