import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Login from './pages/login';
import Signup from './pages/signup';
// import Dashboard from './pages/dashboard';
import Entry from './pages/entry';
// import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      { path: '/signup', element: <Signup /> },
      // { path: '/dashboard', element: <Dashboard /> },
      { path: '/entry', element: <Entry /> },
      // { path: '/profile', element: <Profile /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
