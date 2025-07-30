import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {lazy}  from "react";

const Signin = lazy(() => import('./pages/Signin'));
const Signup = lazy(() => import("./pages/Signup"));
const Blog = lazy(() => import('./pages/Blog'));
const App = lazy(() => import('./App'));
const Blogs = lazy(() => import("./pages/Blogs"));

import { AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';
import { PublicRoute } from './components/PublicRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import MainLayout from './Layouts/MainLayout';
import CreateBlog from './pages/CreateBlog';

const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children : [
        {
          index : true, 
          element : <App />
        },
        {
          path : "/signup",
          element: (
            <PublicRoute>
              <Signup />
            </PublicRoute>
          ),
        },
        {
          path : "/signin",
          element : (
            <PublicRoute>
              <Signin />
            </PublicRoute>
          )
        },
        {
          path : "/blogs",
          element: (
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          ),
        },
        {
          path : "/createblog",
          element: (
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          ),
        },
        {
          path : "/blog/:id",
          element : (
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
          )
        },
      ]
    },
    {
      path: "*", // This will match all undefined routes
      element: <NotFound />,
    },
]);

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <FilterProvider>
        <RouterProvider router={router} />
      </FilterProvider>
    </AuthProvider>
);
