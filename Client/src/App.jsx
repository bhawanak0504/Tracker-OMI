import Signup from "./Signup";
import Login from "./Login";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Home from "./components/onboarding";
import AIChatbot from './AIChatbot';
import ShoppingCart from './ShoppingCart';
import Payment from './Payment';
import CommunityForum from './CommunityForum'; 
import VirtualConsultation from './VirtualConsultation';
import MaternityInsurance from './MaternityInsurance';
import DietPlanner from './DietPlanner';

import Mentalcare from './MentalCare';
import DVisualization from './DVisualization';
import 'leaflet/dist/leaflet.css';
import Resources from './Resources'; 
import Calendar from './Calendar';
import Tracker from './Tracker';
import KickCounter from './KickCounter';
import WeightTracker from './WeightTracker';
import PregnancyMoodTracker from'./PregnancyMoodTracker';

import Profile from './Profile'





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/ai-chatbot" element={<AIChatbot />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} /> 
        <Route path="/payment" element={<Payment />} />
        <Route path="/community-forum" element={<CommunityForum />} />
        <Route path="/virtual-consultation" element={<VirtualConsultation />} />
        <Route path="/maternity-insurance" element={<MaternityInsurance />} />
        <Route path="/diet-planner" element={<DietPlanner />} />
       
        <Route path="/mental-care" element={<Mentalcare />} />
        <Route path="/3d-visualizations" element={< DVisualization/>} />
        <Route path="/educational-resource" element={<Resources/>} />
        <Route path="/calendar" element={<Calendar/>} />
        <Route path="/tracker-tools" element={<Tracker/>} />
        <Route path="/kick-counter" element={<KickCounter />} />
        <Route path="/weight-tracker" element={<WeightTracker/>}/>
        <Route path="/mood-tracker" element={<PregnancyMoodTracker/>}/>
        <Route path="/profile" element={<Profile />} />


    
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
