import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';
import { RootProvider } from '@/provider/RootContext';
import '@/lib/es_polifill';

const App = lazy(() => import('./App'));

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RootProvider value={ { container } }>
        <Suspense fallback={ <div className="progress" /> }>
          <div id="root-content" className="min-h-screen">
            <App />
          </div>
        </Suspense>
      </RootProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
