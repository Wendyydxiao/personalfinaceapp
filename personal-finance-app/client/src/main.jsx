import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Login from './pages/login';
// import Signup from './pages/signup';
// import Dashboard from './pages/dashboard';
// import Profile from './pages/profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      // { path: '/signup', element: <Signup /> },
      // { path: '/dashboard', element: <Dashboard /> },
      // { path: '/profile', element: <Profile /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
