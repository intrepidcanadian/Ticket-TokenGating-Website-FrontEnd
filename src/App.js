import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import MintYourToken from './pages/MintYourToken/MintYourToken';
import Shop from './pages/Shop/Shop';



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mint-token" element={<MintYourToken />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );

}
