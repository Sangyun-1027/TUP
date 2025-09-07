import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import TeamMatching1 from './pages/TeamMatching1';
import TeamMatching2 from './pages/TeamMatching2';
import TeamPage from './pages/TeamPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/TeamMatching1" element={<TeamMatching1 />} />
        <Route path="/TeamMatching2" element={<TeamMatching2 />} />
        <Route path="/TeamPage" element={<TeamPage/>} />
      </Routes>
    </Router>
    <ToastContainer
        position="top-center"
        autoClose={4000} //4초 후 사라짐
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;
