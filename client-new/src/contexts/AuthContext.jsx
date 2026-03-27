import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || "/api";

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      }
    }

    setLoading(false);
  }, []);

const login = async (email, password) => {
  try {
    // 🔥 DEMO USERS (for testing full flow with roles)
    const demoUsers = {
      "manager@demo.com": { role: "manager", name: "Vehicle Manager" },
      "jee@demo.com": { role: "jee", name: "Junior Executive" },
      "oic@demo.com": { role: "oic", name: "Officer In Charge" },
      "supplier@demo.com": { role: "supplier", name: "Supplier" },
    };

    // password same for all demo users
    if (demoUsers[email] && password === "123456") {
      const demoUser = {
        email,
        ...demoUsers[email],
      };

      setUser(demoUser);

      localStorage.setItem("user", JSON.stringify(demoUser));
      localStorage.setItem("token", "demo-token");

      axios.defaults.headers.common["Authorization"] = `Bearer demo-token`;

      return demoUser;
    }

    // ✅ REAL BACKEND LOGIN
    const res = await axios.post("/auth/login", { email, password });

    const { user: userData, token } = res.data;

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return userData;

  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Login failed"
    );
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;