import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './Hooks/useAuth.jsx';
import './Styling/global.css';
import { GameSocketContext, GameSocketProvider } from './Hooks/GameSocketProvider.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <GameSocketProvider>
        <App />
      </GameSocketProvider>
    </AuthProvider>
  </BrowserRouter>
);
