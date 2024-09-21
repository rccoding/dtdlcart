import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, remove, set } from 'firebase/database';
// import QRCode from 'qrcode.react';
import {QRCodeSVG} from 'qrcode.react';
// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyByLz4lXrkyIZj8PaeoLzmbLI4Z9zTSjJI",
  authDomain: "dtdlcart.firebaseapp.com",
  projectId: "dtdlcart",
  storageBucket: "dtdlcart.appspot.com",
  messagingSenderId: "726758780720",
  appId: "1:726758780720:web:ae7003d646f542ef4ae2f5",
  measurementId: "G-30NN22HFMJ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Hardcoded session ID for the collaborative cart
const CART_SESSION_ID = 'shared-cart-123';

export default function App() {
  const [cart, setCart] = useState([]);
  const [products] = useState([
    { id: '1', name: 'Mobile Plan', price: 19.99 },
    { id: '2', name: 'Fiber Internet', price: 39.99 },
    { id: '3', name: 'TV Package', price: 29.99 },
    { id: '4', name: 'Smart Home Bundle', price: 49.99 },
    { id: '5', name: 'International Calling', price: 9.99 },
  ]);

  useEffect(() => {
    const cartRef = ref(database, `carts/${CART_SESSION_ID}`);
    onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCart(Object.values(data));
      } else {
        setCart([]);
      }
    });
  }, []);

  const addToCart = (product) => {
    const cartRef = ref(database, `carts/${CART_SESSION_ID}`);
    push(cartRef, { ...product, cartItemId: Date.now().toString() });
  };

  const removeFromCart = (cartItemId) => {
    const cartItemRef = ref(database, `carts/${CART_SESSION_ID}/${cartItemId}`);
    remove(cartItemRef);
  };

  const clearCart = () => {
    const cartRef = ref(database, `carts/${CART_SESSION_ID}`);
    set(cartRef, null);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Telecom App</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id} className="flex justify-between items-center mb-3 pb-3 border-b">
                <div>
                  <span className="font-medium">{product.name}</span>
                  <span className="block text-sm text-gray-500">${product.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Collaborative Cart</h2>
          {cart.length > 0 ? (
            <ul>
              {cart.map((item) => (
                <li key={item.cartItemId} className="flex justify-between items-center mb-3 pb-3 border-b">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="block text-sm text-gray-500">${item.price.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center my-4">Your cart is empty</p>
          )}
          <div className="mt-4 text-right">
            <span className="font-bold text-lg">Total: ${totalPrice.toFixed(2)}</span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors w-full"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Share Collaborative Cart</h2>
        <div className="flex flex-col items-center">
        <QRCodeSVG value="https://reactjs.org/" />,
          <p className="mt-4 text-sm text-gray-600">Cart Session ID: {CART_SESSION_ID}</p>
          <p className="text-sm text-gray-600">Share this link or scan the QR code to collaborate on this cart</p>
          <input
            type="text"
            value={`https://yourdomain.com/cart/${CART_SESSION_ID}`}
            readOnly
            className="mt-2 p-2 border rounded w-full text-center"
          />
        </div>
      </div>
    </div>
  );
}