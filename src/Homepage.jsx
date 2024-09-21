import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';

const dataPacks = [
  { id: 1, name: "Basic Pack", price: 9.99, description: "1GB data, 100 minutes" },
  { id: 2, name: "Standard Pack", price: 19.99, description: "5GB data, 500 minutes" },
  { id: 3, name: "Premium Pack", price: 29.99, description: "Unlimited data, Unlimited minutes" },
  { id: 4, name: "Family Pack", price: 39.99, description: "20GB shared data, 1000 shared minutes" },
  { id: 5, name: "Business Pack", price: 49.99, description: "50GB data, 2000 minutes, Priority support" },
];

function HomePage() {
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Generate a unique session ID
    const newSessionId = 'session-' + Date.now();
    setSessionId(newSessionId);

    // Set up Firebase listener
    const db = getDatabase();
    const cartRef = ref(db, `carts/${newSessionId}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.items) {
        setCartItems(Object.values(data.items));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addToCart = (item) => {
    const db = getDatabase();
    const cartRef = ref(db, `carts/${sessionId}/items`);
    const newItemRef = push(cartRef);
    set(newItemRef, item);
  };

 const goToCart = () => {
    console.log("Navigating to:", `/shared-cart/${sessionId}`);
    navigate(`/shared-cart/${sessionId}`);
  };


  return (
    <div className="min-h-screen bg-[#E10075] gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-[#E10075] gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-[#E10075] white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Data Packs</h1>
              <button 
                onClick={goToCart}
                className="px-4 py-2 bg-[#E10075] blue-500 text-white text-sm font-medium rounded hover:bg-[#E10075] blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Cart ({cartItems.length})
              </button>
            </div>
            <div className="space-y-6">
              {dataPacks.map((pack) => (
                <div key={pack.id} className="border-b pb-4">
                  <h2 className="text-xl font-semibold">{pack.name}</h2>
                  <p className="text-gray-600">{pack.description}</p>
                  <p className="text-lg font-bold mt-2">${pack.price}</p>
                  <button 
                    onClick={() => addToCart(pack)}
                    className="mt-2 px-4 py-2 bg-[#E10075] green-500 text-white text-sm font-medium rounded hover:bg-[#E10075] green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;