import React, { useEffect, useState } from 'react';

const TradeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weight, setWeight] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track the selected order for closing

  const email = localStorage.getItem('tremail'); // Retrieve the user's email from localStorage

  // Fetch trade orders when the component mounts
  useEffect(() => {
    const fetchTradeOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8000/trade-orders/${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError('Error fetching trade orders');
      } finally {
        setLoading(false);
      }
    };

    fetchTradeOrders();
  }, [email]);

  // Update total amount when weight changes
  const handleWeightChange = (e, order) => {
    const weight = parseFloat(e.target.value);
    setWeight(weight);
    setSelectedOrder(order);
    if (order && order.orderPrice) {
      setTotalAmount(weight * order.orderPrice);
    }
  };

  // Function to confirm the order status
  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8000/confirm-order/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedOrders = orders.map(order =>
          order._id === orderId ? { ...order, orderStatus: 'confirmed' } : order
        );
        setOrders(updatedOrders);
        alert('Order status updated to confirmed');
      } else {
        throw new Error('Failed to confirm order');
      }
    } catch (error) {
      console.error(error);
      alert('Error confirming order');
    }
  };

  // Function to close the order and update the order status
  const handleCloseOrder = async (orderId) => {
    try {
      const closeOrderResponse = await fetch(`http://localhost:8000/close-order/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight,
          totalAmount,
          email,
        }),
      });

      if (closeOrderResponse.ok) {
        // Update the order status locally
        const updatedOrders = orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: 'closed' } : order
        );
        setOrders(updatedOrders);

        // Add amount to wallet
        const walletResponse = await fetch(`http://localhost:8000/update-wallet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: localStorage.getItem('email'),
            amount: totalAmount,
          }),
        });

        if (walletResponse.ok) {
          alert('Order closed and cashback added to wallet');
        } else {
          alert('Order closed, but failed to update wallet');
        }
      } else {
        throw new Error('Failed to close order');
      }
    } catch (error) {
      console.error(error);
      alert('Error closing order');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading trade orders...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Trade Orders</h1>
      {orders.length > 0 ? (
        <ul className="divide-y divide-gray-300">
          {orders.map((order, index) => (
            <li key={index} className="p-4">
              <div className="flex flex-col space-y-2">
                {/* Display Waste Image */}
                {order.photoUrl && (
                  <img 
                    src={order.photoUrl} 
                    alt="Waste Image" 
                    className="w-full h-64 object-cover rounded-md"
                  />
                )}
                <p className="text-lg font-semibold text-gray-800">Trader Name: <span className="text-gray-600">{order.traderName}</span></p>
                <p className="text-gray-600">Trader Email: {order.traderEmail}</p>
                <p className="text-gray-600">Trader Email: {order.userEmail}</p>
                <p className="text-gray-600">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Order Status: <span className={`font-semibold ${order.orderStatus === 'open' ? 'text-green-500' : order.orderStatus === 'confirmed' ? 'text-blue-500' : 'text-red-500'}`}>{order.orderStatus}</span></p>
                
                {order.orderStatus === 'open' && (
                  <>
                  <button
                  onClick={() => {
              
                    const googleMapsUrl = `https://www.google.com/maps?q=${order.lat},${order.lng}`;
                    window.open(googleMapsUrl, '_blank'); // Opens Google Maps in a new tab
                  }}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Customer Location
                </button>
                
                  <button
                    onClick={() => handleConfirmOrder(order._id)}
                    className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md"
                  >
                    Confirm Order
                  </button>
                  </>
                )}

                {order.orderStatus === 'confirmed' && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => handleWeightChange(e, order)}
                      placeholder="Enter weight (kg)"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-gray-600">Total Amount: <span className="font-semibold text-green-600">₹{totalAmount.toFixed(2)}</span></p>
                    <button
                      onClick={() => handleCloseOrder(order._id)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Close Order
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No trade orders found for this account.</p>
      )}
    </div>
  );
};

export default TradeOrders;
