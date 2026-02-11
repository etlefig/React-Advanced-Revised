import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { Root } from "./components/Root";
import { EventsPage } from "./pages/EventsPage";
import { EventPage } from "./pages/EventPage";
import { AboutPage } from "./pages/AboutPage";

import { Provider } from "./components/ui/provider";
import { AppDataProvider } from "./components/AppDataContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppDataProvider>
        <Root />
      </AppDataProvider>
    ),
    children: [
      { index: true, element: <Navigate to="events" replace /> },
      { path: "events", element: <EventsPage /> },
      { path: "events/:id", element: <EventPage /> },
      { path: "about", element: <AboutPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);