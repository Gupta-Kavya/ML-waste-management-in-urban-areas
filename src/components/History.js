import React, { useEffect, useState } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
  } from "react-router-dom";

const History = ({ userEmail }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8000/history/${localStorage.getItem("email")}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching trade orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  // Helper function to get status color
  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'closed':
        return 'bg-green-100 text-green-700 border-green-400';
      case 'open':
        return 'bg-yellow-100 text-yellow-700 border-yellow-400';
      case 'pending':
        return 'bg-blue-100 text-blue-700 border-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-400';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-400';
    }
  };

  return (
<>
    <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="http://localhost:3000/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Mr. Bin</span>
  </a>
  <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">


      <Link to="/wallet" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex  align-middle"><img src='https://i.ibb.co/whr43hq/images-removebg-preview.png' className='w-6 mr-3'/>Wallet</Link>





      <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
  </div>
  <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
    <li>
        <a href="http://localhost:3000/redeem" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent  md:p-0 " aria-current="page">Redeem Cashback</a>
      </li>
      <li>
        <a href="http://localhost:3000/history" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent  md:p-0 " aria-current="page">History</a>
      </li>
    </ul>
  </div>
  </div>
</nav>

<br />
<br />
<br />
<br />

    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Order History</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-gray-800 uppercase text-sm">
                <th className="py-3 px-5 text-left">Trader Name</th>
                <th className="py-3 px-5 text-left">Trader Email</th>
                <th className="py-3 px-5 text-left">Order Date</th>
                <th className="py-3 px-5 text-left">Order Status</th>
                {/* <th className="py-3 px-5 text-left">Order Price</th> */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-5 text-gray-700">{order.traderName}</td>
                  <td className="py-3 px-5 text-gray-700">{order.traderEmail}</td>
                  <td className="py-3 px-5 text-gray-700">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`px-3 py-1 inline-flex rounded-full text-sm font-medium border ${getStatusStyles(order.orderStatus)}`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </td>
                  {/* <td className="py-3 px-5 text-gray-700">{order.orderPrice}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default History;
