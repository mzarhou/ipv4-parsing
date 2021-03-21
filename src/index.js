import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { NotificationsProvider } from './context/notifications-context';

ReactDOM.render(
  <React.StrictMode>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
