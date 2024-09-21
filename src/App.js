import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { initialCartItems } from './cartUtils.js/cart';
import ShareableLink from './QrCodeGenerator';
import './App.css';
import Cart from './cartUtils.js/cart';
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


function App() {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/shared-cart/:sessionId" element={<Cart />} />
          </Routes>
        </div>
      </Router>
    );
}

export default App;