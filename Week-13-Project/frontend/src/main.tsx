// index.tsx
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from "react";
import { AliveScope } from 'react-activation';

import { AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';
import { FormProvider } from './context/FormContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import MainLayout from './Layouts/MainLayout';
import { PublicRoute } from './components/PublicRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import KeepAliveWrapper from './components/KeepAliveWrapper';
import { EditFormProvider } from './context/editFormContext';
import MarkdownGuide from './pages/MarkDownGuide';

const queryClient = new QueryClient();

const MyProfile   = lazy(() => import('./pages/MyProfile'));
const UserProfile   = lazy(() => import('./pages/UserProfile'));
const Signin      = lazy(() => import('./pages/Signin'));
const Signup      = lazy(() => import('./pages/Signup'));
const App         = lazy(() => import('./App'));
const Blogs       = lazy(() => import('./pages/Blogs'));
const CreateBlog  = lazy(() => import('./pages/CreateBlog'));
const EditBlog  = lazy(() => import('./pages/EditBlog'));
const Blog        = lazy(() => import('./pages/Blog'));
const NotFound    = lazy(() => import('./pages/NotFound'));
const MarkDownGuide    = lazy(() => import('./pages/MarkDownGuide'));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // Wrap your entire route tree in AliveScope so that any
      // <KeepAlive> inside your routes will stay in the Router context
      <AliveScope>
        <MainLayout />
      </AliveScope>
    ),
    children: [
      { index: true, element: <App /> },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        )
      },
      {
        path: "signin",
        element: (
          <PublicRoute>
            <Signin />
          </PublicRoute>
        )
      },
      {
        path: "blogs",
        element: (
          <ProtectedRoute>
            {/* Now KeepAliveWrapper (and its children) live inside the same Router context */}
            <KeepAliveWrapper>
              <Blogs />
            </KeepAliveWrapper>
          </ProtectedRoute>
        )
      },
      {
        path: "createblog",
        element: (
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        )
      },
      {
        path : "editblog/:id",
        element : (
          <ProtectedRoute>
              <EditBlog />
          </ProtectedRoute>
        )
      },
      {
        path: "blog/:id",
        element: (
          <ProtectedRoute>
            <Blog />
          </ProtectedRoute>
        )
      },
      {
        path : "my-profile",
        element : (
          <ProtectedRoute>
              <MyProfile />
          </ProtectedRoute>
        )
      },
      {
        path : "user/:email",
        element : (
          <ProtectedRoute>
              <UserProfile />
          </ProtectedRoute>
        )

      },
      {
        path : "/tutorial",
        element : (
            <MarkdownGuide />
        )
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <FormProvider>
        <EditFormProvider>
          <FilterProvider>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </FilterProvider>
        </EditFormProvider>
      </FormProvider>
    </QueryClientProvider>
  </AuthProvider>
);
