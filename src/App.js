import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { initialCartItems } from './cartUtils.js/cart';
import './App.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByLz4lXrkyIZj8PaeoLzmbLI4Z9zTSjJI",
  authDomain: "dtdlcart.firebaseapp.com",
  projectId: "dtdlcart",
  storageBucket: "dtdlcart.appspot.com",
  messagingSenderId: "726758780720",
  appId: "1:726758780720:web:ae7003d646f542ef4ae2f5",
  measurementId: "G-30NN22HFMJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function SharedCartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const { sessionId } = useParams();

  useEffect(() => {
    const cartRef = ref(database, `carts/${sessionId}`);
    onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCartItems(data);
      }
    });
  }, [sessionId]);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    set(ref(database, `carts/${sessionId}`), newCart);
  };

  const handleAddItem = () => {
    const newItem = { id: Date.now(), name: `New Item ${cartItems.length + 1}`, price: Math.floor(Math.random() * 50) + 1 };
    updateCart([...cartItems, newItem]);
  };

  const handleRemoveItem = (itemId) => {
    updateCart(cartItems.filter(item => item.id !== itemId));
  };

  return (
    <div>
      <h2>Shared Cart (Session: {sessionId})</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddItem}>Add Random Item</button>
      <p>Share this link to collaborate: {window.location.href}</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/shared-cart/:sessionId" element={<SharedCartPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;