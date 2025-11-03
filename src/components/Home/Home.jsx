import React from 'react';
import './Home.css'; // <-- 1. IMPORT THE NEW CSS FILE

const Home = () => {
  return (
    // 2. USE "className" INSTEAD OF "style"
    <div className="home-container">
      <h1 className="home-title">Welcome to StuShop</h1>
      <p>Your one-stop shop for student needs.</p>

    </div>
  );
};

export default Home;