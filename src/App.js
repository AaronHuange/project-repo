import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import '@/ui/index.scss';

const Home = lazy(() => import('./pages/index'));

function App() {
  return (
    <Routes>
      <Route path="/*" element={ <Home /> } />
    </Routes>
  );
}

export default App;
