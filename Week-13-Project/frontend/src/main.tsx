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

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/signin",
      element: <Signin />,
    },
    {
      path: "/home",
      element: <Home />,
      children: [
        {
          path: "blog/:id", 
          element: <Blog />
        }
      ]
    },
]);

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
);
