import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {lazy}  from "react";

const Signin = lazy(() => import('./pages/Signin'));
const Signup = lazy(() => import("./pages/Signup"));
const Blog = lazy(() => import('./pages/Blog'));
const App = lazy(() => import('./App'));
const Home = lazy(() => import('./pages/Home'));

import { AuthProvider } from './context/AuthContext';
import { PublicRoute } from './components/PublicRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />
    },
    {
      path: "/signup",
      element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
    },
    {
      path: "/signin",
        element: (
            <PublicRoute>
              <Signin />
            </PublicRoute>
        ),
    },
    {
      path: "/home",
      element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      children: [
        {
          path: "blog/:id", 
          element: <Blog />
        }
      ]
    },
     {
      path: "*", // This will match all undefined routes
      element: <NotFound />,
    },
]);

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
);
