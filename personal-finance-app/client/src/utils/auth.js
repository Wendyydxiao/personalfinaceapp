import decode from "jwt-decode";

class AuthService {
    getProfile() {
        return decode(this.getToken());
    }

    loggedIn() {
        const token = this.getToken();
        return token && !this.isTokenExpired(token);
    }

    isTokenExpired(token) {
        const decoded = decode(token);
        return decoded.exp < Date.now() / 1000;
    }

    getToken() {
        return localStorage.getItem("id_token");
    }

    login(idToken) {
        localStorage.setItem("id_token", idToken);
        window.location.assign("/dashboard"); // After login, ensure you direct to a logged-in route
    }

    logout() {
        localStorage.removeItem("id_token");
        window.location.assign("/"); // Redirect to login page
    }
}

export default new AuthService();
