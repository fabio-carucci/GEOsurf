import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Homepage from './views/homepage/Homepage';
import CompanyProfile from './views/company-profile/CompanyProfile';

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/companyProfile/:id" element={<CompanyProfile />} />
        <Route path="/*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;