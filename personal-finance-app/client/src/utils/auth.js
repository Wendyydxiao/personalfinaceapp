// client/src/utils/auth.js

// Function to get the token from localStorage
export const getToken = () => {
    return localStorage.getItem("token");
};

// Function to set the token in localStorage
export const setToken = (token) => {
    localStorage.setItem("token", token);
};

// Function to check if the user is logged in
export const isLoggedIn = () => {
    return !!localStorage.getItem("token");
};

// Function to log out the user
export const logout = () => {
    localStorage.removeItem("token");
    window.location.assign("/");
};
