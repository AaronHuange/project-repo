import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Example = lazy(() => import('./example'));

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Example />} />
    </Routes>
  );
}

export default App;
