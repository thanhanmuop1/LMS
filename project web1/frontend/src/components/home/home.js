import React from 'react';
import CardComponent from '../card/card';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import '../layout/layout.css';

const Home = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content">
          <CardComponent />
        </main>
      </div>
    </div>
  );
};

export default Home; 