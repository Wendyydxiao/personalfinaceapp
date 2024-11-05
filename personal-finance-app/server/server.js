const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const {
    ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors"); // Import cors
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./resolvers/resolvers");
const { verifyToken } = require("./utils/auth");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Reintroduce CORS middleware
app.use(
    cors({
        origin: "http://localhost:3000", // Adjust this to your client's URL
        credentials: true,
    })
);

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || "";
        const user = token ? verifyToken(token) : null;
        return { user };
    },
    // Optionally enable GraphQL Playground in production
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

// Start server and connect to MongoDB
async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app });

    // Serve static assets in production AFTER applying Apollo middleware
    if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join(__dirname, "../../client/dist")));

        // Serve index.html for any unknown routes, except for /graphql
        app.get("*", (req, res) => {
            if (req.originalUrl.startsWith("/graphql")) {
                return;
            }
            res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
        });
    }

    mongoose
        .connect(
            process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mernAppDB",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        .then(() => console.log("Connected to MongoDB"))
        .catch((error) => console.error("MongoDB connection error:", error));

    app.listen(PORT, () =>
        console.log(
            `Server running at http://localhost:${PORT}${server.graphqlPath}`
        )
    );
}

startApolloServer();
