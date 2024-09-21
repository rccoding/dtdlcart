import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Link } from 'react-router-dom';
import { getDatabase, ref, push, set } from 'firebase/database';

const dataPacks = [
  { id: 1, name: "Basic Pack", price: 9.99, description: "1GB data, 100 minutes" },
  { id: 2, name: "Standard Pack", price: 19.99, description: "5GB data, 500 minutes" },
  { id: 3, name: "Premium Pack", price: 29.99, description: "Unlimited data, Unlimited minutes" },
  { id: 4, name: "Family Pack", price: 39.99, description: "20GB shared data, 1000 shared minutes" },
  { id: 5, name: "Business Pack", price: 49.99, description: "50GB data, 2000 minutes, Priority support" },
];

function HomePage() {
  const [index, setIndex] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const props = useSpring({
    opacity: 1,
    transform: 'translateX(0%)',
    from: { opacity: 0, transform: 'translateX(100%)' },
    reset: true,
    reverse: index % 2 === 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % dataPacks.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
    
    // Add to Firebase
    const db = getDatabase();
    const cartRef = ref(db, 'carts/shared-cart'); // You might want to use a unique ID here
    const newItemRef = push(cartRef);
    set(newItemRef, item);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-center mb-6">Data Packs</h1>
            <animated.div style={props} className="mb-8">
              <h2 className="text-xl font-semibold">{dataPacks[index].name}</h2>
              <p className="text-gray-600">{dataPacks[index].description}</p>
              <p className="text-lg font-bold mt-2">${dataPacks[index].price}</p>
              <button 
                onClick={() => addToCart(dataPacks[index])}
                className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Add to Cart
              </button>
            </animated.div>
            <div className="flex justify-between">
              <Link 
                to="/shared-cart/homepage-cart"
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                View Cart ({cartItems.length})
              </Link>
              <button 
                onClick={() => setIndex((i) => (i + 1) % dataPacks.length)}
                className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Next Pack
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;