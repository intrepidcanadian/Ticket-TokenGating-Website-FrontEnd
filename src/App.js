import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import MintYourToken from './pages/MintYourToken/MintYourToken';
import Shop from './pages/Shop/Shop';
import forcePageReload from './utils/forcePageReload';


export default function App() {
  return (
     <BrowserRouter>
       <Routes>
         <Route path="/" element={<HomePage reloadPage={forcePageReload} />} />
         <Route path="/mint" element={<MintYourToken reloadPage={forcePageReload}  />} />
         <Route path="/shop" element={<Shop reloadPage={forcePageReload} />} />
         <Route path="*" element={<NotFoundPage />} />
       </Routes>
    </BrowserRouter>
  );

}
