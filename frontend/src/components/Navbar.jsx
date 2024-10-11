import { useState } from "react";
import logo from "../assets/logo.png";
import { RiCloseFill, RiMenu3Line } from "@remixicon/react";
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const connectWallet = async () => {
        try {
            if (typeof window.aptos !== 'undefined') {
                await window.aptos.connect();
                const account = await window.aptos.account();
                setWalletAddress(account.address);
            } else {
                console.error('Petra wallet is not installed');
                alert('Please install Petra wallet extension to connect');
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            alert('Failed to connect wallet. Please try again.');
        }
    };

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 m-2 ">
            <div className="text-neutral-500 bg-black/60 backdrop-blur-md max-w-7xl mx-auto px-4 py-3 flex justify-between items-center rounded-xl border border-neutral-800">
               <Link to='/'><img src={logo} alt="Logo" width={120} height={24} /></Link>
                <div className="hidden md:flex space-x-6">
                    <a href='/' className="hover:text-neutral-200">Home</a>
                    <Link to='/market' className="hover:text-neutral-200">BetMarket</Link> 
                    <Link to='/market/:id' className="hover:text-neutral-200">BetDetails</Link> 
                </div>
                <div className="hidden md:flex space-x-4 items-center">
                    <button
                        onClick={connectWallet}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition"
                    >
                        {walletAddress ? walletAddress : "Connect Wallet"}
                    </button>
                </div>
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none" aria-label={isOpen ? "Close Menu" : "Open Menu"}>
                        {isOpen ? <RiCloseFill/> : <RiMenu3Line/> }
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-neutral-900/60 backdrop-blur-md border border-neutral-800 p-4 rounded-xl mt-2">
                    <div className="flex flex-col space-y-4">
                        <a href="#works" className="hover:text-neutral-200">How it Works</a>
                        <a href="#Cards" className="hover:text-neutral-200">Activity</a>
                        <Link to='/market' className="hover:text-neutral-200">BetMarket</Link> 
                        <button
                            onClick={connectWallet}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-neutral-700 transition"
                        >
                            {walletAddress ? walletAddress : "Connect Wallet"}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
