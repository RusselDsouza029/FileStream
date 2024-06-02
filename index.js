import React from "react";
import ReactDOM from "react-dom/client";
import { AppContextProvider } from "./src/context/AppContext";
import App from "./src/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>
);
