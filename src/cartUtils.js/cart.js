import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import ShareableLink from '../QrCodeGenerator';

const users = ['Alice', 'Bob', 'Charlie', 'David'];

const dataPacks = [
  { id: 1, name: "Basic Pack", price: 9.99, description: "1GB data, 100 minutes" },
  { id: 2, name: "Standard Pack", price: 19.99, description: "5GB data, 500 minutes" },
  { id: 3, name: "Premium Pack", price: 29.99, description: "Unlimited data, Unlimited minutes" },
  { id: 4, name: "Family Pack", price: 39.99, description: "20GB shared data, 1000 shared minutes" },
  { id: 5, name: "Business Pack", price: 49.99, description: "50GB data, 2000 minutes, Priority support" },
];

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState('');
  const [selectedPack, setSelectedPack] = useState('');
  const { sessionId } = useParams();

  const database = getDatabase();

  useEffect(() => {
    const cartRef = ref(database, `carts/${sessionId}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCartItems(data?.items || []);
        if (!user) {
          setUser(data.users ? data.users[Math.floor(Math.random() * data.users.length)] : users[Math.floor(Math.random() * users.length)]);
        }
      } else {
        setCartItems([]);
        setUser(users[Math.floor(Math.random() * users.length)]);
        set(cartRef, { items: [], users: [user] });
      }
    });

    return () => unsubscribe();
  }, [sessionId, user, database]);

  const updateCart = (newItems) => {
    const cartRef = ref(database, `carts/${sessionId}`);
    set(cartRef, { items: newItems, users: Array.from(new Set([...cartItems.map(item => item.addedBy), user])) });
  };

  const addToCart = () => {
    if (selectedPack) {
      const packToAdd = dataPacks.find(pack => pack.id === parseInt(selectedPack));
      const newItem = {
        ...packToAdd,
        addedBy: user
      };
      updateCart([...cartItems, newItem]);
      setSelectedPack('');
    }
  };

  const removeItem = (itemId) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    if (itemToRemove && window.confirm(`Are you sure you want to remove "${itemToRemove.name}" from the cart?`)) {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
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
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{item.description}</p>
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
                <div className="flex space-x-2">
                  <select
                    value={selectedPack}
                    onChange={(e) => setSelectedPack(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a data pack</option>
                    {dataPacks.map((pack) => (
                      <option key={pack.id} value={pack.id}>
                        {pack.name} - ${pack.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={addToCart}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={!selectedPack}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ShareableLink />
        </div>
      </div>
    </div>
  );
}

export default Cart;