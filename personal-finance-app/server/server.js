const dotenv = require("dotenv");
dotenv.config(); // Load environment variables at the very beginning

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const path = require("path");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./resolvers/resolvers");
const { verifyToken } = require("./utils/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Import and configure Stripe after dotenv

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    // Serve the React app for any route not handled by the API
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
}

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || "";
        const user = token ? verifyToken(token) : null;
        return { user };
    },
});

// Stripe Checkout session creation route
app.post("/create-checkout-session", async (req, res) => {
    try {
        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "aud",
                        product_data: {
                            name: "Premium Features",
                        },
                        unit_amount: 288, // Amount in cents (e.g., AUD$2.88)
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancel`,
        });

        // Send session ID to the client
        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: "Failed to create Stripe session" });
    }
});

// Start server and connect to MongoDB
async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' }); // Explicitly set the path to /graphql

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
