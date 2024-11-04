// Import required packages
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');
const { verifyToken } = require('./utils/auth');


// Load environment variables
dotenv.config();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Extract token from request headers
    const token = req.headers.authorization || '';
    const user = token ? verifyToken(token) : null; // Verify token and get user data if needed
    return { user };
  },
});

// Start the Apollo Server and apply it as middleware to the Express app
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/personalFinanceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Run the function to start the server
startApolloServer();
