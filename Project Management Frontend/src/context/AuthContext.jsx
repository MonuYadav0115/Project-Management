import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState(true); // app load pe user fetch karo

  // app open hone pe check karo ki user already logged in hai ya nahi
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const savedToken = localStorage.getItem("accessToken");
      if (savedToken) {
        try {
          const res = await getCurrentUser();
          setUser(res.data?.data);
        } catch (error) {
          // token invalid hai toh clear karo
          localStorage.removeItem("accessToken");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
  };

  // isLoading true hai tab tak kuch render mat karo
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
