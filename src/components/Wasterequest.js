import React, { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function UploadPhoto() {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [prediction, setPrediction] = useState('');
  const [nearbyTraders, setNearbyTraders] = useState([]);
  const [biodegradableSuggestions, setBiodegradableSuggestions] = useState('');
  const [cloudinaryUrl, setCloudinaryUrl] = useState(''); // Store Cloudinary image URL

  const handleCapture = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setPrediction('');
    setMessage('');
    setNearbyTraders([]);
    setBiodegradableSuggestions('');  // Reset biodegradable suggestions
  };

  const handleUpload = async () => {
    if (!photo) {
      setMessage('Please capture a photo first.');
      return;
    }

    const email = localStorage.getItem('email');
    const latitude = parseFloat(localStorage.getItem('lat'));
    const longitude = parseFloat(localStorage.getItem('long'));

    if (!email || !latitude || !longitude) {
      setMessage('Required data missing from localStorage.');
      return;
    }

    try {
      const predictFormData = new FormData();
      predictFormData.append('file', photo);

      const predictResponse = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: predictFormData,
      });

      const predictData = await predictResponse.json();
      if (predictResponse.ok) {
        setPrediction(predictData.prediction);
        setMessage('Prediction received successfully!');

        if (predictData.prediction === 'Non-Biodegradable') {
          fetchNearbyTraders(latitude, longitude);
        } else if (predictData.prediction === 'Biodegradable') {
          setBiodegradableSuggestions(
            'Your waste is biodegradable! Consider composting it to reduce landfill waste and create nutrient-rich soil. You can also check out local composting programs or use it in your garden for better growth.'
          );
        }
      } else {
        setMessage(predictData.message || 'Prediction failed');
      }
    } catch (error) {
      setMessage('Error predicting waste type');
    }
  };

  const fetchNearbyTraders = async (userLat, userLong) => {
    try {
      const response = await fetch('http://localhost:8000/traders');
      const traders = await response.json();
      console.log(traders);

      const userLocation = turf.point([userLong, userLat]);
      const nearby = traders.filter(trader => {
        const traderLocation = turf.point([trader.longitude, trader.latitude]);
        const distance = turf.distance(userLocation, traderLocation, { units: 'kilometers' });
        return distance <= 1.5;
      });

      setNearbyTraders(nearby);
    } catch (error) {
      console.error('Error fetching traders:', error);
      setMessage('Failed to fetch nearby traders');
    }
  };

  const handleChooseTrader = async (trader) => {
    if (!photo) {
      setMessage('Please capture a photo first.');
      return;
    }

    // Upload photo to Cloudinary when the user chooses a trader
    const formData = new FormData();
    formData.append('file', photo);
    formData.append('upload_preset', 'mfp4jc0d'); // replace with your Cloudinary upload preset
    formData.append('cloud_name', 'djuxr8bgx'); // replace with your Cloudinary cloud name

    try {
      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/djuxr8bgx/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await cloudinaryResponse.json();
      setCloudinaryUrl(cloudinaryData.secure_url); // Save the image URL

      // Now save the URL to localStorage
      localStorage.setItem('photoUrl', cloudinaryData.secure_url);

      // Now, send the trader choice with the photo URL
      const response = await fetch('http://localhost:8000/choose-trader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          traderName: trader.companyName,
          traderEmail: trader.email,
          userEmail: localStorage.getItem("email"),
          orderPrice: trader.pricePerKg,
          photoUrl: cloudinaryData.secure_url, // Send the Cloudinary URL to the backend
          lng:localStorage.getItem("long"),
          lat:localStorage.getItem("lat")
        }),
      });

      if (response.ok) {
        setMessage(`Successfully chosen trader: ${trader.companyName}`);
        toast(`You have chosen ${trader.companyName} successfully for your waste.`);

        setTimeout(() => {
          window.location = "http://localhost:3000/history"; // Redirect to history page
        }, 3000);
        
        setNearbyTraders([]); // Clear nearby traders
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to choose trader');
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary or choosing trader:', error);
      setMessage('Error uploading to Cloudinary or choosing trader');
    }
  };

  return (
    <div>
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

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Upload Waste Photo</h2>
          {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
          {prediction && <p className="mt-4 text-center text-lg text-green-500">Prediction: {prediction}</p>}

          {biodegradableSuggestions && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800">Suggestions for Biodegradable Waste:</h3>
              <p className="text-sm text-gray-600 mt-2">{biodegradableSuggestions}</p>
            </div>
          )}

          {nearbyTraders.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-center text-gray-800">Nearby Traders (within 1.5km):</h3>
              <div className="space-y-4">
                {nearbyTraders.map((trader, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <p className="text-sm font-medium text-gray-600">
                      <strong>Company Name:</strong> {trader.companyName}
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      <strong>Email:</strong> {trader.email}
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      <strong>Price per kg:</strong> {trader.pricePerKg}
                    </p>
                    <button
                      onClick={() => handleChooseTrader(trader)}
                      className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
                    >
                      Choose Trader
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-center space-y-4">
            {preview ? (
              <img src={preview} alt="Preview" className="w-48 h-48 object-cover mx-auto rounded-lg shadow-md" />
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                No photo selected
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCapture}
              className="w-full mt-4 text-center bg-gray-100 rounded-lg p-3"
            />
            <button
              onClick={handleUpload}
              className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
            >
              Upload and Predict
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPhoto;
