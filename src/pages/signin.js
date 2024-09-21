import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseInit';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User signed in:', user);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/'); // Redirect after successful sign-in
      })
      .catch((error) => {
        console.error('Error signing in:', error);
        alert(error.message);
      });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
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
            Sign In
          </button>
        </form>
      </div>
      <div className="w-1/2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Hello, Friend!</h1>
        <button onClick={() => navigate('/')} className="mt-8 border-white border py-2 px-6 rounded-full">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignInPage;