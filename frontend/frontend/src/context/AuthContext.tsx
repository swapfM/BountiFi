"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AuthContextType {
  name: string | null;
  accessToken: string | null;
  userType: string | null;
  setName: (name: string | null) => void;
  setAccessToken: (token: string | null) => void;
  setUserType: (user: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setAccessToken(localStorage.getItem("access_token"));
    setUserType(localStorage.getItem("user_type"));
  }, []);

  useEffect(() => {
    if (name) {
      localStorage.setItem("name", name);
    } else {
      localStorage.removeItem("name");
    }
  }, [name]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    } else {
      localStorage.removeItem("access_token");
    }
  }, [accessToken]);

  useEffect(() => {
    if (userType) {
      localStorage.setItem("user_type", userType);
    } else {
      localStorage.removeItem("user_type");
    }
  }, [userType]);

  return (
    <AuthContext.Provider
      value={{
        name,
        accessToken,
        userType,
        setName,
        setAccessToken,
        setUserType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
