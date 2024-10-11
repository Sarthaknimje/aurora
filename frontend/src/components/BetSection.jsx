import React from 'react';
import { BET_CONTENT } from '../constants';

const BetSection = () => {
  return (
    <section id="betsection">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 border-t border-neutral-800">
          <h2 className="text-3xl lg:text-5xl mt-20 tracking-tighter bg-gradient-to-t from-neutral-50 via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
            {BET_CONTENT.sectionTitle}
          </h2>
          <p className="mt-4">{BET_CONTENT.sectionDescription}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BET_CONTENT.bets.map((bet, index) => (
           <div key={index} className="bg-neutral-900 p-6 rounded-xl shadow-lg flex flex-col items-center">
           <img src={bet.imagesrc} className="rounded-lg mb-4 h-20 w-20" />  {/* Set h-20 and w-20 for equal size */}
           <div className="text-center">
               <h3 className="text-xl font-semibold mb-4">{bet.title}</h3>
               <p className="text-neutral-400">{bet.description}</p>
           </div>
           <button className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg mt-5'>
               Let's Bet 💸
           </button>
       </div>
       
          ))}
        </div>
      </div>
    </section>
  );
};

export default BetSection;
