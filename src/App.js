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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-center">Shared Cart</h1>
              <p className="mt-2 text-center text-sm text-gray-600">Session: {sessionId}</p>
              <p className="mt-2 text-center text-sm text-gray-600">You are: {user}</p>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price}</p>
                        {item.addedBy && <p className="text-xs text-gray-400">Added by {item.addedBy}</p>}
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={addItem}
                  className="w-full px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Add Random Item
                </button>
              </div>
            </div>
          </div>
          <ShareableLink />
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