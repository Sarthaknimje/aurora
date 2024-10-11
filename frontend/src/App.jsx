import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import BetMarket from "./components/BetMarket";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import BetDetails from "./components/BetDetails";
import Footer from "./components/Footer";
import BetDetails from "./components/BetDetails";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router> 
      <main className="text-sm text-neutral-300 antialiased ">
        <Navbar />
        <Routes>
          <Route path= '/' element={<Homepage/>} /> 
          <Route path='/market' element={<BetMarket />} />
          <Route path="/market/:id" element={<BetDetails />} />
        </Routes>
        <Footer/>
      </main>
    </Router>
  );
}

export default App;
