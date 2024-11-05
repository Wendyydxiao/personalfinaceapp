// client/src/main.jsx

import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import App from "./App";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Entry from "./pages/entry";

// GraphQL endpoint
const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
});

// Set up the authentication link
const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const token = localStorage.getItem("token");
    // Return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : "",
        },
    };
});

// Initialize Apollo Client
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Login /> },
            { path: "/signup", element: <Signup /> },
            { path: "/entry", element: <Entry /> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <ChakraProvider>
        <ApolloProvider client={client}>
            <RouterProvider router={router} />
        </ApolloProvider>
    </ChakraProvider>
);
