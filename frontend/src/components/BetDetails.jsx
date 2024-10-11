import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BET_CONTENT } from '../constants';

const BetDetails = () => {
  const { id } = useParams();
  const [bet, setBet] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    const fetchBet = async () => {
      // In a real application, you would fetch this data from your backend
      const fetchedBet = BET_CONTENT.bets.find((b) => b.id === parseInt(id));
      setBet(fetchedBet);
    };
    fetchBet();
  }, [id]);

  const handleBuy = async () => {
    if (!prediction || !betAmount) {
      alert('Please select a prediction and enter a bet amount.');
      return;
    }

    try {
      if (typeof window.aptos !== 'undefined') {
        const response = await window.aptos.connect();
        const account = response.address;

        const transaction = {
          type: "entry_function_payload",
          function: "betting_platform_addr::betting_platform::place_bet",
          arguments: [bet.id.toString(), betAmount, prediction === 'yes'],
          type_arguments: [],
        };

        const pendingTransaction = await window.aptos.signAndSubmitTransaction(transaction);
        setTransactionStatus('Transaction submitted. Waiting for confirmation...');

        const txnHash = pendingTransaction.hash;
        await window.aptos.waitForTransaction(txnHash);

        setTransactionStatus('Transaction confirmed!');

        // Store bet in MongoDB
        await axios.post('http://localhost:5000/api/place-bet', {
          eventId: bet.id,
          userId: account,
          amount: betAmount,
          prediction: prediction === 'yes',
          settled: false
        });

      } else {
        alert('Aptos wallet is not installed. Please install it to place a bet.');
      }
    } catch (error) {
      console.error('Error:', error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  };

  if (!bet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        className="bet-details p-6 bg-neutral-900 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src={bet.image} alt={bet.title} className="rounded-lg mb-4 h-40 w-40 mx-auto" />
        <h2 className="text-2xl font-semibold mb-4 text-center">{bet.title}</h2>
        <p className="text-neutral-400 mb-4">{bet.description}</p>
        <div className="flex justify-around mb-4">
          <motion.button
            className={`py-2 px-4 rounded-lg ${prediction === 'yes' ? 'bg-green-600' : 'bg-neutral-700'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setPrediction('yes')}
          >
            Yes ({bet.yesPercentage}%)
          </motion.button>
          <motion.button
            className={`py-2 px-4 rounded-lg ${prediction === 'no' ? 'bg-red-600' : 'bg-neutral-700'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setPrediction('no')}
          >
            No ({bet.noPercentage}%)
          </motion.button>
        </div>
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 mb-4 rounded-lg text-black"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
        <motion.button
          className="bg-blue-600 w-full py-3 px-4 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBuy}
        >
          Place Bet
        </motion.button>
        {transactionStatus && (
          <p className="text-center mt-4 text-neutral-400">{transactionStatus}</p>
        )}
        <div className="text-neutral-400 mt-4">
          <p>Volume: {bet.volume} APT</p>
          <p>Liquidity: {bet.liquidity} APT</p>
          <p>Expires At: {bet.expiryDate}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default BetDetails;