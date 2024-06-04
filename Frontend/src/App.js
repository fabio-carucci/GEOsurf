import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Homepage from './views/homepage/Homepage';
import CompanyProfile from './views/company-profile/CompanyProfile';
import Newspage from './views/news-page/Newspage';
import { useAuth } from './context/AuthContextProvider';
import FavoritePage from './views/favorites-page/FavoritePage';

function App() {

  const { user } = useAuth();
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/companyProfile/:id" element={<CompanyProfile />} />
        <Route path="/news" element={<Newspage />} />
        <Route path="/*" element={<h1>Page Not Found</h1>} />
        {user && <Route path='/favorites' element={<FavoritePage />} />}
      </Routes>
    </Router>
  );
}

export default App;