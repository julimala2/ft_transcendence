import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import { AccountLayout } from './Account/AccountLayout';
import { AccountPublic } from './Account/AccountPublic';
import { accountTabs } from './Account/AccountTabs';
import { Modal } from './Account/Modal';
import Background from './Components/Background';
import { MainContainer } from './Components/Components';
import { Header } from './Navigation/Header';
import { HomePage } from './Pages/HomePage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { QuickResultsPage } from './Quizs/Offline/QuickResultsPage';
import { CustomResultsPage } from './Quizs/Offline/CustomResultsPage';
import { QuizCreation } from './Quizs/Edit/QuizCreation';
import { QuizEdit } from './Quizs/Edit/QuizEdit';
import { AttemptPage } from './Quizs/Offline/AttemptPage';
import OfflineMenu from './Quizs/Offline/OfflineMenu';
import CommuStart from './Quizs/Offline/CommuStart';
import { CustomStart } from './Quizs/Offline/CustomStart';
import { QuickStart } from './Quizs/Offline/QuickStart';
import { GamePage } from './Quizs/Online/GamePage';
import TestPage from './Pages/TestPage';
import { OnlineMenu } from './Quizs/Online/OnlineMenu';
import { Room } from './Quizs/Online/Room';

export default function App() {
  const location = useLocation();
  const background = location.state?.backgroundLocation
    ? { pathname: location.state.backgroundLocation }
    : undefined;

  return (
    <>
      <Background color1="#667eea" color2="#ffffff" duration={10} />
      <div className="relative min-h-screen">
        <Header />
        <MainContainer>
          
          <Routes location={background || location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/account" element={<Navigate to="/" replace />} />
            <Route path="/game/:roomId" element={<GamePage />} />
            <Route path="/play/attempt/:attemptId?" element={<AttemptPage />} />
            <Route path="/play/offline/quick" element={<QuickStart />} />
            <Route path="/play/offline/custom" element={<CustomStart />} />
            <Route
              path="/results/quick/:attemptId"
              element={<QuickResultsPage />}
            />
            <Route
              path="/results/custom/:attemptId"
              element={<CustomResultsPage />}
            />
            <Route path="/users/:userId" element={<AccountPublic />} />
            <Route path="/quiz/create" element={<QuizCreation />} />
            <Route path="/quiz/edit/:id?" element={<QuizEdit />} />
            <Route path="/play/offline/menu" element={<OfflineMenu />} />
            <Route path="/play/offline/commu" element={<CommuStart />} />
            <Route path="/quiz/online" element={<OnlineMenu/>} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="*" element={<NotFoundPage />} />
            {/* Test Page ! */}
            <Route path ="/testpage" element={<TestPage />} />
          </Routes>
        </MainContainer>

        {background && (
          <Routes location={location}>
            <Route
              path="/account"
              element={
                <Modal>
                  <AccountLayout />
                </Modal>
              }
            >
              <Route index element={accountTabs[0].element} />
              {accountTabs.map(tab => (
                <Route key={tab.path} path={tab.path} element={tab.element} />
              ))}
            </Route>
          </Routes>
        )}
      </div>
    </>
  );
}
