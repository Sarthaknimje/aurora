import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BetMarket = () => {
  const [bets, setBets] = useState([]);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bets');
        setBets(response.data);
      } catch (error) {
        console.error('Error fetching bets:', error);
      }
    };
    fetchBets();
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-4 flex flex-col items-center text-center mt-40'>
      <div className="text-center text-neutral-400 text-5xl">💸 Welcome to BetSet Marketplace 💸</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-28">
        {bets.map((bet) => (
          <div key={bet._id} className="bg-neutral-900 p-6 rounded-xl shadow-lg flex flex-col items-center hover:bg-neutral-700 transition-all duration-300 ease-in-out transform hover:scale-105">
            <img src={bet.image} alt={bet.title} className="rounded-lg mb-4 h-20 w-20" />
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">{bet.title}</h3>
              <p className="text-neutral-400">{bet.description}</p>
            </div>
            <Link to={`/market/${bet._id}`}>
              <button className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg mt-5 text-xl'>
                Let's Bet 💰
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BetMarket;