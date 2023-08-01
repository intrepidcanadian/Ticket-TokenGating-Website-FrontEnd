import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import BuyTickets from './pages/BuyTickets/BuyTickets';
import Tickets from './pages/Tickets/Tickets';
import forcePageReload from './utils/forcePageReload';
import Shop from './pages/Shop/Shop';


export default function App() {
  return (
     <BrowserRouter>
       <Routes>
         <Route path="/" element={<HomePage reloadPage={forcePageReload} />} />
         <Route path="/buy-tickets" element={<BuyTickets />} />
         <Route path="/tickets" element={<Tickets reloadPage={forcePageReload} />} />
         <Route path="/shop" element={<Shop reloadPage={forcePageReload} />} />
         <Route path="*" element={<NotFoundPage />} />
       </Routes>
    </BrowserRouter>
  );

}
