// context/AuthContext.jsx — React Context API for auth (alternative to Recoil atoms)
//
// This file shows how Context API works alongside Recoil.
// We use Recoil for most global state, but Context is great for
// values that rarely change (like theme, locale).
//
// In this app we keep a lightweight AuthContext so you can see
// BOTH patterns side-by-side.

import { createContext, useContext, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import api from "../utils/api";
import { userAtom, streamTokenAtom } from "../store/atoms";

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the Provider component that wraps the app
export const AuthProvider = ({ children }) => {
  const [bootstrapped, setBootstrapped] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const setStreamToken = useSetRecoilState(streamTokenAtom);

  // On app load: re-fetch user + Stream token if a JWT exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("skillforge_token");
    if (!token) {
      setBootstrapped(true);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        if (data.streamToken) {
          setStreamToken(data.streamToken);
          localStorage.setItem("skillforge_stream_token", data.streamToken);
        }
        setBootstrapped(true);
      })
      .catch(() => {
        localStorage.removeItem("skillforge_token");
        localStorage.removeItem("skillforge_stream_token");
        setBootstrapped(true);
      });
  }, [setUser, setStreamToken]);

  // Don't render the app until we've checked auth status
  if (!bootstrapped) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <div className="w-8 h-8 border-2 border-forge-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

// 3. Custom hook to consume the context
export const useAuthContext = () => useContext(AuthContext);
