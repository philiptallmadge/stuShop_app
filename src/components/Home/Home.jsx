import React from 'react';
import './Home.css'; // <-- 1. IMPORT THE NEW CSS FILE
import StuShopLogo from './StuShop_image1.webp'; // <-- IMPORT IMAGE

const Home = () => {
  return (
    // 2. USE "className" INSTEAD OF "style"
    <div className="home-container">
      <img src={StuShopLogo} alt="StuShop Logo" className="home-logo" />
      <h1 className="home-title">Welcome to StuShop</h1>
      <p>Your one-stop shop for Notre Dame student needs.</p>

    </div>
  );
};

export default Home;