import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';

// ... existing imports ...

function SignInPage({ onSignIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    onSignIn(username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  );
}

function HomePage({ user, onSignOut }) {
  return (
    <div>
      <h1>Welcome, {user}!</h1>
      <button onClick={onSignOut}>Sign Out</button>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  const handleSignIn = (username) => {
    setUser(username);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signin" element={
            user ? <Navigate to="/" /> : <SignInPage onSignIn={handleSignIn} />
          } />
          <Route path="/" element={
            user ? <HomePage user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;