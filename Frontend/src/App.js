import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Homepage from './views/homepage/Homepage';
import CompanyProfile from './views/company-profile/CompanyProfile';
import Newspage from './views/news-page/Newspage';
import { useAuth } from './context/AuthContextProvider';
import FavoritePage from './views/favorites-page/FavoritePage';
import Footer from './components/footer/Footer';
import NotFound from './views/notFound-page/NotFound';

function App() {

  const { user } = useAuth();
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/companyProfile/:id" element={<CompanyProfile />} />
        <Route path="/news" element={<Newspage />} />
        <Route path="/*" element={<NotFound />} />
        {user && <Route path='/favorites' element={<FavoritePage />} />}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;