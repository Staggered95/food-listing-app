// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { LoadingProvider } from './context/LoadingContext.jsx'; 

const GOOGLE_CLIENT_ID = "65546563629-gmsvsi9q2blv94h9u94rorphsncbhks3.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
     <AuthProvider>
       <LoadingProvider> {/* 2. Wrap the App */}
          <App />
        </LoadingProvider>
     </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);