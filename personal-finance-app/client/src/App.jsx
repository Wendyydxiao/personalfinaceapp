import "./App.css";
import { Outlet } from "react-router-dom";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
});

// Middleware to add auth token to each request (if available)
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("id_token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink), // Concatenate the auth link with the HTTP link
    cache: new InMemoryCache(),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Outlet />
        </ApolloProvider>
    );
}

export default App;
