import { AccountFriends } from './AccountFriends';
import { AccountMyQuizs } from './AccountMyQuizs';
import { AccountProfile } from './AccountProfile';
import { AccountSettings } from './AccountSettings';
import { AccountStats } from './AccountStats';

export const accountTabs = [
  { path: 'profile', label: 'Profil', element: <AccountProfile /> },
  { path: 'friends', label: 'Amis', element: <AccountFriends /> },
  { path: 'settings', label: 'Paramètres', element: <AccountSettings /> },
  { path: 'stats', label: 'Statistiques', element: <AccountStats /> },
  { path: 'myQuizs', label: 'Mes quizs', element: <AccountMyQuizs /> },
];
