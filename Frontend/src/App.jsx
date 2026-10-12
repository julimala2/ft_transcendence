import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './Pages/Layout';
import { Header } from './Navigation/Header';
import { HomePage } from './Pages/HomePage';
import { QuizPage } from './Pages/QuizPage';
import { QuizSelectionPage } from './Pages/QuizSelectionPage';
import { SettingsPage } from './Pages/SettingsPage';
import { ProfilePage } from './Pages/ProfilePage';
import { FriendsPage } from './Pages/FriendsPage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { QuizOfflinePage } from './Pages/QuizOfflinePage';
import { MyQuizs } from './Pages/MyQuizs';
import { GameRoom } from './Components/GameRoom';
import { Modal } from './Account/Modal';
import { AccountLayout } from './Account/AccountLayout';
import { accountTabs } from './Account/AccountTabs';
import { RequireAuth } from './Hooks/requireAuth';

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
        <Route path="/play/:quizId?" element={<QuizPage />} />
        <Route path="/quizzes" element={<QuizSelectionPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/users/:userId" element={<ProfilePage />} />
        {/* <Route path="/quizoffline" element={<QuizOfflinePage/>} /> */}
        {/* <Route path="/myQuizs" element={<MyQuizs/>} /> */}
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