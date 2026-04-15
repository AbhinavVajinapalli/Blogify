import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './app/store';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './styles/index.scss';

const googleClientId =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  '611469724829-1bsfbegjfvv7rm18u61fcjeprip5gdgv.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
