import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './Hooks/useAuth.jsx';
import './Styling/global.css';
import { SocketProvider } from './Hooks/SocketProvider.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <SocketProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
      </SocketProvider>
  </BrowserRouter>
);
