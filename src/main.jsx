import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "preline";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ReportForm from "./pages/ReportFormPage.jsx";

if (
  window.matchMedia("(prefers-color-scheme: dark)").matches ||
  (!("theme" in localStorage) && localStorage.theme === "dark")
) {
  document.documentElement.classList.add("dark");
  localStorage.theme = "dark";
} else {
  document.documentElement.classList.remove("dark");
  localStorage.theme = "light";
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} errorElement={<ErrorPage />}>
        <Route index element={<HomePage />} />
        <Route path="/report" element={<ReportForm />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
