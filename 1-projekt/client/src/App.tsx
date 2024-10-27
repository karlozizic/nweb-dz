import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import GiftCardsPage from "./GiftCardsPage";
import GenerateGiftCardPage from "./GenerateGiftCardPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GiftCardsPage />} />
          <Route path="/generateGiftCard" element={<GenerateGiftCardPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
