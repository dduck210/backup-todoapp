import React, { createContext, useState, useEffect } from "react";

// Tạo context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    username: "Unknown User",
    token: null,
  });

  // Khi mount, load từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          id: parsed.id,
          username: parsed.username,
          token,
        });
      } catch {
        setUser({ id: null, username: "Unknown User", token: null });
      }
    }
  }, []);

  // Hàm update user khi login/logout
  const updateUser = (userData) => {
    if (userData) {
      localStorage.setItem("token", userData.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: userData.id, username: userData.username })
      );
      setUser(userData);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser({ id: null, username: "Unknown User", token: null });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
