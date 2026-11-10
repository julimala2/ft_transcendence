import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { GameSocketProvider } from './Hooks/GameSocketProvider';
import { AuthProvider } from './Hooks/useAuth.jsx';
import './Styling/global.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <GameSocketProvider>
        <App />
      </GameSocketProvider>
    </AuthProvider>
  </BrowserRouter>
);
