// hooks/useAuth.js — Custom hook for authentication actions
//
// Custom hooks encapsulate reusable logic.
// This hook provides login, register, and logout functions
// that update both Recoil state and localStorage.

import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { userAtom, tokenAtom, streamTokenAtom } from "../store/atoms";
import api from "../utils/api";

const useAuth = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [token, setToken] = useRecoilState(tokenAtom);
  const setStreamToken = useSetRecoilState(streamTokenAtom);
  const navigate = useNavigate();

  /**
   * Save auth data to both Recoil atoms and localStorage
   */
  const saveAuth = ({ user, token, streamToken }) => {
    setUser(user);
    setToken(token);
    setStreamToken(streamToken);
    localStorage.setItem("skillforge_token", token);
    if (streamToken) localStorage.setItem("skillforge_stream_token", streamToken);
  };

  /**
   * Register a new user
   */
  const getHomeRoute = (role) =>
    role === "instructor" || role === "admin" ? "/instructor" : "/dashboard";

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    saveAuth(data);
    navigate(getHomeRoute(data.user?.role));
    return data;
  };

  /**
   * Login an existing user
   */
  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    saveAuth(data);
    navigate(getHomeRoute(data.user?.role));
    return data;
  };

  /**
   * Logout — clear all auth state
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setStreamToken(null);
    localStorage.removeItem("skillforge_token");
    localStorage.removeItem("skillforge_stream_token");
    navigate("/");
  };

  return { user, token, register, login, logout, isAuthenticated: !!token };
};

export default useAuth;
