import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SignupForm from './components/Signup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './components/Login';
import LocationMap from './components/Location';
import TraderForm from './components/Trader';
import Wallet from './components/Wallet';
import TradeOrders from './components/Traderorders';
import Redeem from './components/Redeem';
import History from './components/History';

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignupForm />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/*",
    element: <App />,
  },
  {
    path: "Location",
    element: <LocationMap />,
  },
  {
    path: "Trader",
    element: <TraderForm />,
  },
  {
    path: "Wallet",
    element: <Wallet />,
  },
  {
    path: "traderorders",
    element: <TradeOrders />,
  },
  {
    path: "redeem",
    element: <Redeem />,
  },
  {
    path: "history",
    element: <History />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
  <RouterProvider router={router} />
  <ToastContainer />
</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
