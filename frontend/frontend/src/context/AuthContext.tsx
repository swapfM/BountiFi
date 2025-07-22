"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useDisconnect } from "wagmi";

interface AuthContextType {
  name: string | null;
  accessToken: string | null;
  userType: string | null;
  isLoading: boolean;
  setName: (name: string | null) => void;
  setAccessToken: (token: string | null) => void;
  setUserType: (user: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      throw error;
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      throw error;
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      throw error;
    }
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [name, setNameState] = useState<string | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [userType, setUserTypeState] = useState<string | null>(null);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const initializeAuth = () => {
      const storedName = safeLocalStorage.getItem("name");
      const storedToken = safeLocalStorage.getItem("access_token");
      const storedUserType = safeLocalStorage.getItem("user_type");

      setNameState(storedName);
      setAccessTokenState(storedToken);
      setUserTypeState(storedUserType);
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const setName = useCallback((newName: string | null) => {
    setNameState(newName);
    if (newName) {
      safeLocalStorage.setItem("name", newName);
    } else {
      safeLocalStorage.removeItem("name");
    }
  }, []);

  const setAccessToken = useCallback((newToken: string | null) => {
    setAccessTokenState(newToken);
    if (newToken) {
      safeLocalStorage.setItem("access_token", newToken);
    } else {
      safeLocalStorage.removeItem("access_token");
    }
  }, []);

  const setUserType = useCallback((newUserType: string | null) => {
    setUserTypeState(newUserType);
    if (newUserType) {
      safeLocalStorage.setItem("user_type", newUserType);
    } else {
      safeLocalStorage.removeItem("user_type");
    }
  }, []);

  const logout = useCallback(() => {
    setNameState(null);
    setAccessTokenState(null);
    setUserTypeState(null);
    safeLocalStorage.removeItem("name");
    safeLocalStorage.removeItem("access_token");
    safeLocalStorage.removeItem("user_type");
    disconnect();
  }, [disconnect]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        name,
        accessToken,
        userType,
        setName,
        setAccessToken,
        setUserType,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
