import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Link } from 'react-router-dom';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';

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
  const [sessionId, setSessionId] = useState('');

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

    // Generate a unique session ID
    const newSessionId = 'session-' + Date.now();
    setSessionId(newSessionId);

    // Set up Firebase listener
    const db = getDatabase();
    const cartRef = ref(db, `carts/${newSessionId}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.items) {
        setCartItems(data.items);
      }
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const addToCart = (item) => {
    const db = getDatabase();
    const cartRef = ref(db, `carts/${sessionId}`);
    const newItemRef = push(cartRef);
    set(newItemRef, item);
  };

  return (
    <div className="min-h-screen bg-[#E10075] gray-100">
      <nav className="bg-[#E10075] blue-500 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Data Pack Store</h1>
        <Link to={`/shared-cart/${sessionId}`} className="text-white font-semibold">
          Cart ({cartItems.length})
        </Link>
      </nav>
      <div className="py-6 flex flex-col items-center">
        <div className="w-full max-w-md">
          <animated.div style={props} className="bg-[#E10075] white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold">{dataPacks[index].name}</h2>
            <p className="text-gray-600">{dataPacks[index].description}</p>
            <p className="text-lg font-bold mt-2">${dataPacks[index].price}</p>
            <button 
              onClick={() => addToCart(dataPacks[index])}
              className="mt-4 px-4 py-2 bg-[#E10075] blue-500 text-white text-sm font-medium rounded hover:bg-[#E10075] blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add to Cart
            </button>
          </animated.div>
          <div className="flex justify-between">
            <button 
              onClick={() => setIndex((i) => (i - 1 + dataPacks.length) % dataPacks.length)}
              className="px-4 py-2 bg-[#E10075] gray-500 text-white text-sm font-medium rounded hover:bg-[#E10075] gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Previous Pack
            </button>
            <button 
              onClick={() => setIndex((i) => (i + 1) % dataPacks.length)}
              className="px-4 py-2 bg-[#E10075] gray-500 text-white text-sm font-medium rounded hover:bg-[#E10075] gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Next Pack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;