import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Results from './pages/Results/Results';
import Upload from './pages/Upload/Upload';

const App: React.FC = () => {
  return (
    <Router>
      <Header />

      <div style={{ marginTop: '60px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

export default App;