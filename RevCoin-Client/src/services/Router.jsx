import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../components/LoginPage.jsx';
import RegisterPage from '../components/RegisterPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
]);
