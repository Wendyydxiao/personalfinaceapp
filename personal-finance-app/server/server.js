// Import required packages
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');
const { verifyToken } = require('./utils/auth');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Create Apollo Server instance with type definitions, resolvers, and context for authentication
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Extract token from request headers for user authentication
    const token = req.headers.authorization || '';
    const user = token ? verifyToken(token) : null; // Verify token and get user data if needed
    return { user };
  },
});

// Function to start Apollo Server and apply it as middleware to the Express app
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB using Mongoose
  mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mernAppDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Run the function to start the server
startApolloServer();
