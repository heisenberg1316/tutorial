import ReactDOM from 'react-dom/client';
import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

const App = lazy(() => import('./App'));
const Landing = lazy(() => import('./components/Landing'));
const About = lazy(() => import('./components/About'));
const Dashboard = lazy(() => import("./components/Dashboard"));
const TermsandConditions = lazy(() => import("./components/TermsandConditions"));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'dashboard', element: <Dashboard /> },
      { 
        path: 'about',
        element: <About />,
        children : [
          {index : true, element : <TermsandConditions />}
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={router} />
  </Suspense>
);
