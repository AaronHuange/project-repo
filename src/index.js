import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as HttpProvider } from 'use-http';
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';
import { RootProvider } from '@/provider/RootContext';
import { ToastContainer, toastContainerProps } from '@/components/toastify';
import '@/lib/es_polifill';
import http from '@/config/http';

const App = lazy(() => import('./App'));

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RootProvider value={ { container } }>
        <HttpProvider
          url={http.dev.httpProvider}
          options={{
            headers: {
              token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTEyODUyODYsInVzZXJJZCI6IjMifQ.yNETL2fmlq6asdk1eewyPUCw-ym2SpZ-eJTSUqlOTLY',
              skipCheck: "i'm good person,don't check request.ok?",
              accept: 'application/json',
            },
            cachePolicy: 'no-cache',
            interceptors: {
              response: async ({ response }) => {
                if (response.data.errors && response.data.errors[0]?.extensions?.code === 'UNAUTHENTICATED') {
                  window.location.href = `/auth/login?continue_url=${encodeURIComponent(window.location.href)}`;
                }
                return response;
              },
            },
          }}
        >
          <Suspense fallback={ <div className="progress" /> }>
            <div id="root-content" className="min-h-screen">
              <App />
              <ToastContainer
                {...toastContainerProps}
              />
            </div>
          </Suspense>
        </HttpProvider>
      </RootProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
