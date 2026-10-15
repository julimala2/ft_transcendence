import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './Navigation/Header';
import { HomePage } from './Pages/HomePage';
import { QuizSelectionPage } from './Pages/quizs/QuizSelectionPage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { Modal } from './Account/Modal';
import { AccountLayout } from './Account/AccountLayout';
import { accountTabs } from './Account/AccountTabs';
import { AttemptPage } from './Pages/quizs/AttemptPage';
import { ResultsPage } from './Pages/quizs/ResultsPage';

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
        <Route path="/play/attempt/:attemptId?" element={<AttemptPage />} />
        <Route path="/quizzes" element={<QuizSelectionPage />} />
        <Route path="/results/:attemptId" element={<ResultsPage />} />
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