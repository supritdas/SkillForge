// src/main.jsx — React app bootstrap

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* RecoilRoot provides global state management (replaces Redux for this app) */}
    <RecoilRoot>
      {/* BrowserRouter provides client-side routing via React Router v6 */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
