import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseInit';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User signed up:', user);
        navigate('/homepage'); // Redirect after successful sign-up
      })
      .catch((error) => {
        console.error('Error signing up:', error);
        alert(error.message);
      });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            className="p-3 border mb-4 w-64"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="p-3 border mb-4 w-64"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Sign Up
          </button>
        </form>
      </div>
      <div className="w-1/2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Hello, Friend!</h1>
        <p className="mt-4 text-lg">Enter your personal details and start your journey with us.</p>
        <button onClick={() => navigate('/')} className="mt-8 border-white border py-2 px-6 rounded-full">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;