// server/utils/auth.js
const jwt = require("jsonwebtoken");

//Define the secret and expiration for the JWT
const secret = process.env.JWT_SECRET || "mysecretsshhhhh";
const expiration = "1h";

// Function to sign a token for a user
function signToken({ _id, username, email }) {
    const payload = {
        id: _id,
        username,
        email,
    };
    return jwt.sign(payload, secret, { expiresIn: expiration });
}

// Middleware function to verify the token and add user data to the request context
function authMiddleware({ req }) {
    // Get the token from the header, query, or cookie
    let token =
        req.headers.authorization || req.query.token || req.cookies.token;

    // Remove "bearer " from the token if it's present
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trim();
    }

    // If no token, continue without modifying the request
    if (!token) {
        return req;
    }

    try {
        //Verify the token and attatch decoded data to the request
        const { data } = jwt.verify(token, secret);
        req.user = data; //Add the user data to req.user
    } catch {
        console.log("Invalid token");
    }

    //Return the request object with or without the user data
    return req;
}

module.exports = { signToken, authMiddleware };
