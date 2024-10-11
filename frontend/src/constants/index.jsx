import prediction1 from "../assets/prediction1.png";
import prediction2 from "../assets/prediction2.png";
import prediction3 from "../assets/prediction3.png";
import prediction4 from "../assets/prediction4.png";
import prediction5 from "../assets/prediction5.png";
import prediction6 from "../assets/prediction6.png";

import {
  RiBarChart2Line,
  RiCheckDoubleLine,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
  RiTimerFlashLine,
  RiWalletLine,

} from "@remixicon/react";

export const HERO_CONTENT = {
  badgeText: "🚀 The Power of Prediction in Your Hands!",
  mainHeading: "Your Next Prediction \n Starts with BetSet",
  subHeading:
"Bet smarter, win bigger! Experience fast, secure betting with BetSet. Your odds, your game—anytime, anywhere!",
  callToAction: {
    primary: "Bet Now 💸",
  },

};



export const HOW_IT_WORKS_CONTENT = {  
  sectionTitle: "How it works!",  
  sectionDescription: 
    "Start betting securely on BetSet with our simple 6-step process. From wallet connection to winning predictions, BetSet uses blockchain for a transparent betting experience.",  
  steps: [    
    {      
      title: "Connect Your Wallet",      
      description: 
        "Seamlessly connect your crypto wallet to BetSet for secure transactions using blockchain technology.",        
    },    
    {      
      title: "Choose Your Bet",      
      description: 
        "Select the event or match on which you'd like to place a bet. Use our intuitive interface to find the right match.",    
    },    
    {      
      title: "Predict Yes/No",      
      description: 
        "Make your prediction by choosing a simple Yes or No option. Bet confidently using decentralized technology.",        
    },    
    {      
      title: "Confirm Your Bet",      
      description: 
        "Finalize and confirm your bet using smart contracts for added transparency and trust.",         
    },    
    {      
      title: "Wait for Results",      
      description: 
        "Once the event concludes, the blockchain verifies the outcome to ensure a fair result.",       
    },    
    {      
      title: "Claim Your Rewards",      
      description: 
        "If your prediction is correct, you will automatically receive 2x your initial stake in your wallet. If not, your bet is forfeited.",        
    },  
  ],  
};


export const KEY_FEATURES_CONTENT = {  
  sectionTitle: "Bet Smarter with These Key Features",  
  sectionDescription: 
    "Everything you need for a seamless blockchain-based betting experience, all in one place.",  
  features: [    
    {      
      id: 1,      
      icon: <RiWalletLine className="w-8 h-8" />,      
      title: "Secure Wallet Integration",      
      description: 
        "Connect your crypto wallet securely to place bets and receive payouts using blockchain technology.",    
    },    
    {      
      id: 2,      
      icon: <RiBarChart2Line className="w-8 h-8" />,      
      title: "Real-Time Bet Tracking",      
      description: 
        "Track your ongoing bets, view results in real-time, and stay informed with live updates.",    
    },    
    {      
      id: 3,      
      icon: <RiCheckDoubleLine className="w-8 h-8" />,      
      title: "Yes/No Bet Predictions",      
      description: 
        "Place simple Yes or No bets on various events with instant confirmations and transparency.",    
    },    
    {      
      id: 4,      
      icon: <RiShieldCheckLine className="w-8 h-8" />,      
      title: "Blockchain-Powered Transparency",      
      description: 
        "Enjoy trustless betting, where every transaction and outcome is verified using smart contracts.",    
    },    
    {      
      id: 5,      
      icon: <RiMoneyDollarCircleLine className="w-8 h-8" />,      
      title: "Instant Payouts",      
      description: 
        "Receive instant payouts if you predict correctly, with 2x returns straight to your wallet.",    
    },    
    {      
      id: 6,      
      icon: <RiTimerFlashLine className="w-8 h-8" />,      
      title: "Automated Betting Workflows",      
      description: 
        "Automate your betting strategies with advanced tools, allowing you to manage bets effortlessly.",    
    },  
  ],  
};


export const BET_CONTENT = {
  sectionTitle: "Choose Your Bet",
  sectionDescription:
    "BetSet offers multiple choices to users for betting, from beginner to pro.",
    bets: [
      {
        id: 1,
        title: "Who Will Win the 2024 US Presidential Election?",
        description: "Place your bets on who will emerge victorious in the 2024 US Presidential race.",
        shortDescription: "Bet on the 2024 Presidential election winner.",
        image: prediction1,
        yesPercentage: 0,
        noPercentage: 100,
        volume: 0,
        liquidity: 0,
        expiryDate: "Nov 5, 2024"
      },
      {
        id: 2,
        title: "What will the Bitcoin Price by End of 2024 be?",
        description: "Predict whether Bitcoin will cross the $100,000 mark by the end of 2024.",
        shortDescription: "Bet on Bitcoin's price by the end of 2024.",
        image: prediction2,
        yesPercentage: 0,
        noPercentage: 100,
        volume: 0,
        liquidity: 0,
        expiryDate: "Dec 31, 2024"
      },
      {
        id: 3,
        title: "Will Apple Release an AR/VR Device in 2025?",
        description: "Bet on whether Apple will unveil its first full-featured AR/VR device by 2025.",
        shortDescription: "Bet on Apple's AR/VR device release.",
        image: prediction3,
        yesPercentage: 0,
        noPercentage: 100,
        volume: 0,
        liquidity: 0,
        expiryDate: "Dec 31, 2025"
      },
      {
        id: 4,
        title: "Will Ronaldo hit 100M YouTube subscribers by end of October?",
        description: "This market will resolve to Yes if Ronaldo's YouTube channel shows 100M.",
        shortDescription: "Bet on whether Ronaldo will reach 100M subscribers.",
        image: prediction4,
        yesPercentage: 0,
        noPercentage: 100,
        volume: 4374.75,
        liquidity: 0,
        expiryDate: "Nov 1, 2024"
      },
      {
        id: 5,
        title: "Ethereum Network Upgrade Success Prediction",
        description: "Predict if the upcoming Ethereum network upgrade will be successfully implemented.",
        shortDescription: "Bet on Ethereum's network upgrade success.",
        image: prediction5,
        yesPercentage: 0,
        noPercentage: 100,
        volume: 0,
        liquidity: 0,
        expiryDate: "TBD"
      },
      {
        id: 6,
        title: "Next SpaceX Launch Date Predict exact date.",
        description: "Bet on the exact date for the next SpaceX rocket launch. Will it be on time?",
        shortDescription: "Bet on the next SpaceX launch date.",
        image: prediction6,
        yesPercentage: 0,
        noPercentage: 100,
        volume: 0,
        liquidity: 0,
        expiryDate: "TBD"
      }
  ]
  
};


