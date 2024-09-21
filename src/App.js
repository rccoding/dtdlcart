import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { initialCartItems } from './cartUtils.js/cart';
import ShareableLink from './QrCodeGenerator';
import SignUpPage from './pages/signup';
import SignInPage from './pages/signin';
import HomePage from './pages/homepage';
import FirstPage from './pages/firstpage';
import './App.css';
import {QRCodeSVG} from 'qrcode.react';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfEptfM-6JOyrFhKMoVYpjgkF7XaYE8xs",
  authDomain: "dtdl-3f499.firebaseapp.com",
  databaseURL: "https://dtdl-3f499-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dtdl-3f499",
  storageBucket: "dtdl-3f499.appspot.com",
  messagingSenderId: "882326858288",
  appId: "1:882326858288:web:5fef4932b03a8080b0dbf5",
  measurementId: "G-TKPRE9FH6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const users = ['Alice', 'Bob', 'Charlie', 'David'];

function SharedCartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState('');
  const { sessionId } = useParams();
  const [totalCartValue, setTotalCartValue] = useState(0);
  useEffect(() => {
    const cartRef = ref(database, `carts/${sessionId}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCartItems(data.items || []);
        console.log('Updated cart items:', data.items);
        if (!user && data.users && data.users.length > 0) {
          setUser(data.users[Math.floor(Math.random() * data.users.length)]);
        } else if (!user) {
          // If no users in data, initialize with the first two users
          const initialUsers = users.slice(0, 2);
          setUser(initialUsers[Math.floor(Math.random() * initialUsers.length)]);
          set(cartRef, { items: data.items || [], users: initialUsers });
        }
      } else {
        // Initialize with empty array if no data
        setCartItems([]);
        const initialUsers = users.slice(0, 2); // Start with 2 random users
        setUser(initialUsers[Math.floor(Math.random() * initialUsers.length)]);
        set(cartRef, { items: [], users: initialUsers });
      }
    }, (error) => {
      console.error('Error fetching data:', error);
    });
  
    return () => unsubscribe();
  }, [sessionId, user]);
  useEffect(() => {
    const db = getDatabase();
    const cartRef = ref(db, `carts/${sessionId}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.items) {
        const items = Array.isArray(data.items) ? data.items : Object.values(data.items);
        setCartItems(items);
        // Calculate total cart value
        const total = items.reduce((sum, item) => sum + item.price, 0);
        setTotalCartValue(total);
      } else {
        setCartItems([]);
        setTotalCartValue(0);
      }
    });

    return () => unsubscribe();
  }, [sessionId]);
  const dataPacks = {
    "dataPacks": [
      {
        "id": 1,
        "name": "Basic Starter Pack",
        "data": "2GB",
        "calls": "100 minutes",
        "texts": "500 SMS",
        "validity": "28 days",
        "price": 9.99,
        "description": "Perfect for light users. Includes 2GB data, 100 minutes of calls, and 500 SMS."
      },
      {
        "id": 2,
        "name": "Standard Monthly Plan",
        "data": "10GB",
        "calls": "Unlimited",
        "texts": "Unlimited",
        "validity": "30 days",
        "price": 19.99,
        "description": "Great for average users. Enjoy 10GB data with unlimited calls and texts."
      },
      {
        "id": 3,
        "name": "Premium Data Pack",
        "data": "50GB",
        "calls": "Unlimited",
        "texts": "Unlimited",
        "validity": "30 days",
        "price": 29.99,
        "description": "Ideal for heavy data users. Get 50GB data along with unlimited calls and texts."
      },
      {
        "id": 4,
        "name": "Family Share Plan",
        "data": "100GB",
        "calls": "Unlimited",
        "texts": "Unlimited",
        "validity": "30 days",
        "price": 49.99,
        "description": "Perfect for families. Share 100GB data among 4 lines with unlimited calls and texts."
      },
      {
        "id": 5,
        "name": "International Traveler Pack",
        "data": "5GB",
        "calls": "500 minutes",
        "texts": "500 SMS",
        "validity": "14 days",
        "price": 39.99,
        "description": "Stay connected abroad. Includes 5GB data, 500 minutes, and 500 SMS valid in 50+ countries."
      },
      {
        "id": 6,
        "name": "Weekend Booster Pack",
        "data": "20GB",
        "calls": "Unlimited",
        "texts": "Unlimited",
        "validity": "2 days",
        "price": 5.99,
        "description": "Boost your weekend with 20GB data and unlimited calls/texts, valid for 2 days."
      },
      {
        "id": 7,
        "name": "Streaming Enthusiast Pack",
        "data": "30GB",
        "calls": "200 minutes",
        "texts": "1000 SMS",
        "validity": "30 days",
        "price": 24.99,
        "description": "Optimized for streaming. Get 30GB high-speed data with unlimited streaming on select apps."
      },
      {
        "id": 8,
        "name": "Business Pro Plan",
        "data": "75GB",
        "calls": "Unlimited",
        "texts": "Unlimited",
        "validity": "30 days",
        "price": 59.99,
        "description": "Designed for professionals. Enjoy 75GB data, unlimited calls/texts, and priority customer support."
      },
      {
        "id": 9,
        "name": "Student Special Pack",
        "data": "15GB",
        "calls": "500 minutes",
        "texts": "Unlimited",
        "validity": "30 days",
        "price": 14.99,
        "description": "Tailored for students. Get 15GB data, 500 minutes of calls, and unlimited texts at a discounted rate."
      },
      {
        "id": 10,
        "name": "Senior Citizen Plan",
        "data": "5GB",
        "calls": "Unlimited",
        "texts": "500 SMS",
        "validity": "30 days",
        "price": 12.99,
        "description": "Simplified plan for seniors. Includes 5GB data, unlimited calls, and 500 SMS with large font size user guide."
      }
    ]
  }
  const updateCart = (newItems) => {
    const cartRef = ref(database, `carts/${sessionId}`);
    onValue(cartRef, (snapshot) => {
      const currentData = snapshot.val() || {};
      const updatedUsers = currentData.users ? 
        Array.from(new Set([user, ...currentData.users])) : 
        [user, ...users.filter(u => u !== user)];
      set(cartRef, { items: newItems, users: updatedUsers })
        .then(() => console.log('Cart updated successfully'))
        .catch((error) => console.error('Error updating cart:', error));
    }, { onlyOnce: true });
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: `Item ${cartItems.length + 1}`,
      price: Math.floor(Math.random() * 100) + 1,
      addedBy: user
    };
    updateCart([...cartItems, newItem]);
  };

  
  const removeItem = (itemId) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    if (itemToRemove && window.confirm(`Are you sure you want to remove "${itemToRemove.name}" from the cart?`)) {
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, removedBy: user } : item
      ).filter(item => !item.removedBy);
      updateCart(updatedItems);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 py-6 flex flex-col justify-center sm:py-12">
  <div className="relative py-3 sm:max-w-xl sm:mx-auto">
    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
      <div className="max-w-md mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-800">Shared Cart</h1>
          <p className="mt-2 text-center text-sm text-gray-600">Session: {sessionId}</p>
          <p className="mt-2 text-center text-sm text-gray-600">You are: {user}</p>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price}</p>
                    {item.addedBy && <p className="text-xs text-gray-400">Added by {item.addedBy}</p>}
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-1 bg-pink-500 text-white text-sm font-medium rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition duration-300"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4" style={{ width: 'max-content' }}>
                {dataPacks.dataPacks.map((pack) => (
                  <div key={pack.id} className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg shadow-md p-6 w-80 flex flex-col justify-between transform hover:scale-105 transition duration-300">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-800">{pack.name}</h2>
                      <p className="text-gray-600 mb-4">{pack.description}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        Data: {pack.data} | Calls: {pack.calls}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Texts: {pack.texts} | Validity: {pack.validity}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold mb-4 text-pink-600">${pack.price}</p>
                      <button 
                        onClick={() => addItem(pack)}
                        className="w-full px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-8">
        <div className="text-lg font-semibold text-gray-800">
          Total: ${totalCartValue.toFixed(2)}
        </div>
        <div className="text-lg font-semibold text-gray-800">
          Cart ({cartItems.length})
        </div>
      </div>
      <div className="mt-8">
        <ShareableLink />
      </div>
    </div>
  </div>
</div>
  );
}

function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<FirstPage/>} />
          <Route path="/shared-cart/:sessionId" element={<SharedCartPage />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;