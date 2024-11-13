import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Wallet = () => {
  const [email, setEmail] = useState(localStorage.getItem('email')); // Use current user's email
  const [walletAmount, setWalletAmount] = useState(0);

  // Fetch wallet amount when the component mounts
  useEffect(() => {
    fetchWalletAmount();
  }, []);

  // Fetch wallet details from the backend
  const fetchWalletAmount = async () => {
    try {
      const response = await fetch(`http://localhost:8000/wallet/${email}`);
      const data = await response.json();
      if (data.amount) {
        setWalletAmount(data.amount);  // If wallet exists, set the amount
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
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
  
  
        <Link to="wallet" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex  align-middle"><img src='https://i.ibb.co/whr43hq/images-removebg-preview.png' className='w-6 mr-3'/>Wallet</Link>
  
  
  
  
  
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
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
    <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Your Wallet</h1>
      <div className="mb-4">
        <p className="text-lg font-semibold">Email: <span className="text-gray-600">{email}</span></p>
        <p className="text-xl font-bold">Wallet Amount: <span className="text-green-500">₹{walletAmount.toFixed(2)}</span></p>
      </div>
      {/* Remove the button to add amount */}
      {/* No Modal or Add Amount functionality */}
    </div>
    </>
  );
};

export default Wallet;
