// ======================================
// ✅ src/services/authAPI.js
// ======================================
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const authAPI = {
    signup: async (userData) => {
        try {
            const res = await axios.post(`${API_URL}/auth/signup`, userData);
            return res.data;
        } catch (err) {
            console.error("❌ Signup error:", err);
            throw err;
        }
    },

    login: async (credentials) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, credentials);
            const data = res.data;

            if (data.token) {
                switch (data.role) {
                    case "ADMIN":
                        localStorage.setItem("admin_token", data.token);
                        localStorage.setItem("admin_user", JSON.stringify(data));
                        localStorage.setItem("isAdminAuth", "true");
                        break;

                    case "EMPLOYEE":
                    case "STAFF":
                        localStorage.setItem("staff_token", data.token);
                        localStorage.setItem("staff_user", JSON.stringify(data));
                        break;

                    default:
                        localStorage.setItem("user_token", data.token);
                        localStorage.setItem("user_user", JSON.stringify(data));
                        break;
                }
            }

            return data;
        } catch (err) {
            console.error("❌ Login error:", err);
            throw err;
        }
    },

    logout: () => {
        [
            "admin_token",
            "staff_token",
            "user_token",
            "jwt_token",
            "admin_user",
            "staff_user",
            "user_user",
            "user",
            "isAdminAuth",
        ].forEach((k) => localStorage.removeItem(k));
    },

    getToken: () =>
        localStorage.getItem("admin_token") ||
        localStorage.getItem("staff_token") ||
        localStorage.getItem("user_token") ||
        localStorage.getItem("jwt_token"),

    getCurrentUser: () => {
        const user =
            localStorage.getItem("admin_user") ||
            localStorage.getItem("staff_user") ||
            localStorage.getItem("user_user") ||
            localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => !!authAPI.getToken(),
};
