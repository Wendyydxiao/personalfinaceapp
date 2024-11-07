// server.js
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const path = require("path");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./resolvers/resolvers");
const { verifyToken } = require("./utils/auth");
const cors = require("cors");

// Temporary hard-coded values for debugging purposes
const JWT_SECRET = "your_jwt_secret_key"; // Replace this with your secret key
const MONGODB_URI = "mongodb://127.0.0.1:27017/mernAppDB"; // Replace with your MongoDB URI
const PORT = 4000; // Port for running the server

const app = express();

// CORS configuration
const corsOptions = {
    origin: "http://localhost:3000", // Replace with your front-end URL
    credentials: true, // Allow credentials (e.g., cookies, auth headers)
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
}

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        let token = req.headers.authorization || "";
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim();
        }
        try {
            console.log("Verifying token:", token);
            const user = verifyToken(token); // Verify token using the newly added function
            console.log("Token verification successful:", user);
            return { user };
        } catch (error) {
            console.error("Token verification error:", error);
            return { user: null };
        }
    },
});

// Start server and connect to MongoDB
async function startApolloServer() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

        // Start Apollo Server
        await server.start();
        console.log("Apollo Server started successfully");
        server.applyMiddleware({
            app,
            cors: corsOptions,
        });
        console.log("Apollo middleware applied successfully");

        // Start Express server
        app.listen(PORT, () =>
            console.log(
                `Server running at http://localhost:${PORT}${server.graphqlPath}`
            )
        );
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startApolloServer();
