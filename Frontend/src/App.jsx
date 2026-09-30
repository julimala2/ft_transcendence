import { Routes, Route } from 'react-router-dom';
import { Layout } from './Pages/Layout';
import { HomePage } from './Pages/HomePage';
import { QuizPage } from './Pages/QuizPage';
import { SettingsPage } from './Pages/SettingsPage';
import { LoginPage } from './Pages/LoginPage';
import { ProfilePage } from './Pages/ProfilePage';
import { FriendsPage } from './Pages/FriendsPage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { QuizOfflinePage } from './Pages/QuizOfflinePage';
import { MyQuizs } from './Pages/MyQuizs';
import { GameRoom } from './Components/GameRoom';


function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/play" element={<QuizPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/users/:userId" element={<ProfilePage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/quizoffline" element={<QuizOfflinePage />} />
                <Route path="/myQuizs" element={<MyQuizs/>}/>
                <Route path="/game/:roomId" element={<GameRoom />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
