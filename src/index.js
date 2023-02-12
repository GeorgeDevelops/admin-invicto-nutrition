import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';
import './responsive.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faRightFromBracket, faPlus, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import Orders from './components/orders';
import Products from './components/products';
import Login from './components/login';
import OrderDetails from './components/orderDetails';
import Home from './components/home';
import NewProduct from './components/newProduct';
import Promo from './components/promo';
import Email from './components/email';
import ErrorPage from './components/error-page';


const container = document.getElementById('root');
const root = createRoot(container);
library.add(faUser, faRightFromBracket, faPlus, faArrowsRotate)

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/inicio",
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/pedidos",
        element: <Orders />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/productos",
        element: <Products />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/pedidos/:id/detalles",
        element: <OrderDetails />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/productos/nuevo",
        element: <NewProduct />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/productos/:id/editar",
        element: <NewProduct />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/promociones",
        element: <Promo />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/correo",
        element: <Email />,
        errorElement: <ErrorPage />,
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  }
]);

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);