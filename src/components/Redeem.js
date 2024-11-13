import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
  } from "react-router-dom";

const Redeem = () => {
  const offers = [
    {
      logo: 'https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png',
      offerTitle: 'Get 10% Cashback',
      cashbackAmount: '₹500',
      expiryDate: 'Expires in 5 days',
      platform: 'Amazon',
    },
    {
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-ba5r3OHWGBgTu9ZaIxHeklOI9fIzLTvRLA&s',
      offerTitle: 'Flat ₹200 Cashback',
      cashbackAmount: '₹200',
      expiryDate: 'Expires in 7 days',
      platform: 'Flipkart',
    },
    {
      logo: 'https://1000logos.net/wp-content/uploads/2022/08/Myntra-Logo.png',
      offerTitle: '15% Cashback on Orders',
      cashbackAmount: '₹300',
      expiryDate: 'Expires in 3 days',
      platform: 'Myntra',
    },
    {
      logo: 'https://www.logo.wine/a/logo/Snapdeal/Snapdeal-Logo.wine.svg',
      offerTitle: 'Up to ₹1000 Cashback',
      cashbackAmount: '₹1000',
      expiryDate: 'Expires in 10 days',
      platform: 'Snapdeal',
    },
    {
      logo: 'https://logos-world.net/wp-content/uploads/2022/12/Ajio-Logo.png',
      offerTitle: '₹400 Cashback on Orders',
      cashbackAmount: '₹400',
      expiryDate: 'Expires in 12 days',
      platform: 'Ajio',
    },
  ];

  const handleRedeem = (platform) => {
    alert(`Redeeming cashback for ${platform}`);
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

    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Redeem Cashback Offers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center space-y-4"
          >
            <img src={offer.logo} alt={offer.platform} className="w-16 h-16" />
            <h3 className="text-xl font-semibold text-center">{offer.offerTitle}</h3>
            <div className="text-lg text-blue-600">{offer.cashbackAmount}</div>
            <div className="text-sm text-gray-500">{offer.expiryDate}</div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => handleRedeem(offer.platform)}
            >
              Redeem Cashback
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Redeem;
