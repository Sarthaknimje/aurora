import React from 'react';
import { HERO_CONTENT } from "../constants";
import { HOW_IT_WORKS_CONTENT } from "../constants";
import { KEY_FEATURES_CONTENT } from "../constants";
import { BET_CONTENT } from '../constants';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

const Homepage = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 flex flex-col items-center text-center mt-40'>
      <div className='mb-8 border-neutral-800 px-3 py-2 rounded-full text-xs'>
        {HERO_CONTENT.badgeText}
      </div>
      <h1 className='text-5xl lg:text-8xl my-4 font-semibold tracking-tighter bg-gradient-to-b from-neutral-50 via-neutral-300 to-neutral-700 bg-clip-text text-transparent'>
        Your Next Prediction <br />
        <Typewriter
          options={{
            strings: ['Starts with BetSet', 'Unlock the Future'],
            autoStart: true,
            loop: true,
            delay: 75,
            deleteSpeed: 50,
          }}
        />
      </h1>
      <p className='mt-6 text-neutral-400 max-w-xl'>
        {HERO_CONTENT.subHeading}
      </p>
      <div className='mt-6 space-x-4'>
        <Link to='/market' className='inline-block bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg font-medium'>
          {HERO_CONTENT.callToAction.primary}
        </Link>
        <br /><br />
      </div>
      <div className="max-w-7xl mx-auto px-4">        
      <div className="text-center mb-12 border-t border-neutral-800">          
        <h2 className="text-3xl lg:text-5xl mt-20 tracking-tighter bg-gradient-to-t from-neutral-50 via-neutral-300 to-neutral-600 bg-clip-text text-transparent">            
          {HOW_IT_WORKS_CONTENT.sectionTitle}          
        </h2>          
        <p className="mt-4 text-neutral-400 max-w-xl mx-auto">            
          {HOW_IT_WORKS_CONTENT.sectionDescription}          
        </p>        
      </div>        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">          
        {HOW_IT_WORKS_CONTENT.steps.map((step, index) => (            
          <div key={index} className="bg-neutral-900 p-6 rounded-xl shadow-lg flex flex-col justify-between hover:bg-neutral-700 transition-all duration-300 ease-in-out transform hover:scale-105">              
            <div>                
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>                
              <p className="text-neutral-400 mb-4">{step.description}</p>              
            </div>            
          </div>          
        ))}        
      </div>      
    </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="text-center mb-12 border-t border-neutral-800 ">
          <h2 className="lg:text-5xl mt-20 tracking-tighter bg-gradient-to-t from-neutral-50 via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
            {KEY_FEATURES_CONTENT.sectionTitle}
          </h2>
          <p className="mt-4">
            {KEY_FEATURES_CONTENT.sectionDescription}
          </p>
        </div>
        <div className="flex flex-wrap justify-between">
          {KEY_FEATURES_CONTENT.features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center w-full md:w-1/2 lg:w-1/3 p-6">
              <div className="flex justify-center items-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl">{feature.title}</h3>
              <p className="mt-2 text-neutral-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 border-t border-neutral-800">
          <h2 className="text-3xl lg:text-5xl mt-20 tracking-tighter bg-gradient-to-t from-neutral-50 via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
            {BET_CONTENT.sectionTitle}
          </h2>
          <p className="mt-4">{BET_CONTENT.sectionDescription}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {BET_CONTENT.bets.slice(0, 3).map((bet, index) => (
            <div key={index} className="bg-neutral-900 p-6 rounded-xl shadow-lg flex flex-col items-center hover:bg-neutral-700 transition-all duration-300 ease-in-out transform hover:scale-105">
              <img src={bet.image} className="rounded-lg mb-4 h-20 w-20" />
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">{bet.title}</h3>
                <p className="text-neutral-400">{bet.description}</p>
              </div>
              <Link to='/market'>
                <button className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg mt-5 text-lg'>
                  Let's Bet 💰
                </button>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mb-12 border-t border-neutral-800">
          <Link to='/market'>
            <h2 className="text-center text-blue-500 text-3xl mt-12">Show More 💸</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
