require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const path = require("path");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./resolvers/resolvers");
const { authMiddleware } = require("./utils/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mernAppDB";
const PORT = process.env.PORT || 4000;

if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Missing STRIPE_SECRET_KEY in environment variables.");
    process.exit(1);
}

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    const clientBuildPath = path.join(__dirname, "../client/dist");
    app.use(express.static(clientBuildPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(clientBuildPath, "index.html"));
    });
}

// Log the CLIENT_URL to verify it's set correctly
console.log("Client URL:", process.env.CLIENT_URL);

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => authMiddleware({ req }),
});

// Stripe Payment Endpoint
app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "aud",
                        product_data: { name: "Premium Features" },
                        unit_amount: 288, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/profile`,
            cancel_url: `${process.env.CLIENT_URL}/profile`,
        });

        res.json({ id: session.id, url: session.url }); // Return the full URL
    } catch (error) {
        console.error("Error creating Stripe session:", error.message);
        res.status(500).json({ error: "Failed to create Stripe session" });
    }
});

// Start Apollo Server and MongoDB Connection
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
        server.applyMiddleware({ app });
        console.log("Apollo Server is ready");

        // Start Express Server
        app.listen(PORT, () =>
            console.log(
                `🚀 Server is running at http://localhost:${PORT}${server.graphqlPath}`
            )
        );
    } catch (error) {
        console.error("Error starting the server:", error.message);
    }
}

startApolloServer();
