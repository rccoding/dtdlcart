import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/signin'); // Redirect to SignIn if not logged in
    }
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to the HomePage!</h1>
      <button
        onClick={() => {
          localStorage.removeItem('isLoggedIn');
          navigate('/signin');
        }}
        className="bg-red-500 text-white py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </div>
  );
};

export default HomePage;