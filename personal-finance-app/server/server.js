require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const path = require("path");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./resolvers/resolvers");
const { verifyToken } = require("./utils/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Import and configure Stripe
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const MONGODB_URI = "mongodb://127.0.0.1:27017/mernAppDB"; // Replace with your MongoDB URI
const PORT = 4000; // Port for running the server

const app = express();

// CORS configuration
// const corsOptions = {
//     origin: "*", // Replace with your front-end URL
//     credentials: true,
// };
// app.use(cors(corsOptions));
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
        // Apply authMiddleware to add user info to req
        req = authMiddleware({ req });

        // Debugging logs
        console.log("Context user:", req.user); // Log the user data in context

        return { user: req.user }; // Pass user from authMiddleware to context
    },
});

// Stripe payment endpoint
app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "aud",
                        product_data: { name: "Premium Features" },
                        unit_amount: 288, // Amount in cents (e.g., AUD$2.88)
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancel`,
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: "Failed to create Stripe session" });
    }
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
            // cors: corsOptions,
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
