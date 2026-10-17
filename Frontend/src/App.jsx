import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './Navigation/Header';
import { HomePage } from './Pages/HomePage';
import { GamePage } from './Quizs/Online/GamePage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { Modal } from './Account/Modal';
import { AccountLayout } from './Account/AccountLayout';
import { accountTabs } from './Account/AccountTabs';
import { AttemptPage } from './Quizs/Offline/AttemptPage';
import { QuickStart } from './Quizs/Offline/QuickStart';
import { CustomStart } from './Quizs/Offline/CustomStart';
import { QuickResultsPage } from './Quizs/Offline/QuickResultsPage';
import { CustomResultsPage } from './Quizs/Offline/CustomResultsPage';

export default function App() {
    const location = useLocation();
    const background =
      location.state?.backgroundLocation ??
      (location.pathname.startsWith('/account') ? { pathname: '/' } : null);

  return (
    <>
      <Header />
      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:roomId" element={<GamePage />} />
        <Route path="/play/attempt/:attemptId?" element={<AttemptPage />} />
        <Route path="/play/offline/quick" element={<QuickStart />} />
        <Route path="/play/offline/custom" element={<CustomStart />} />
        <Route path="/results/quick/:attemptId" element={<QuickResultsPage />} />
        <Route path="/results/custom/:attemptId" element={<CustomResultsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/account" element={<Modal><AccountLayout /></Modal>}>
            <Route index element={<Navigate to="profile" replace />} />
            {accountTabs.map((tab) => (
              <Route key={tab.path} path={tab.path} element={tab.element} />
            ))}
          </Route>
        </Routes>
      )}
    </>
  );
}