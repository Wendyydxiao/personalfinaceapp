const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./resolvers/resolvers");
require("dotenv").config();

const startTestServer = async () => {
    const app = express();

    // Initialize Apollo Server with typeDefs and resolvers for GraphQL testing
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            // Optional: Mock token handling here if testing authentication
            const token = req.headers.authorization || "";
            return { token };
        },
    });

    // Start Apollo Server and apply middleware to the Express app
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    // Connect to MongoDB
    try {
        await mongoose.connect(
            process.env.MONGODB_URI ||
                "mongodb://localhost:27017/financeTracker",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("MongoDB connected for testing");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }

    // Start the Express server on a specific port for testing
    const PORT = process.env.TEST_PORT || 4001;
    app.listen(PORT, () => {
        console.log(
            `Test server running at http://localhost:${PORT}${server.graphqlPath}`
        );
    });
};

startTestServer();
