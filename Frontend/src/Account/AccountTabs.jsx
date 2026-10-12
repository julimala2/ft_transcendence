import { ProfilePage } from '../Pages/ProfilePage';
import { FriendsPage } from '../Pages/FriendsPage';
import { SettingsPage } from '../Pages/SettingsPage';

export const accountTabs = [
  { path: 'profile',  label: 'Profil',     element: <ProfilePage /> },
  { path: 'friends',  label: 'Amis',       element: <FriendsPage /> },
  { path: 'settings', label: 'Paramètres', element: <SettingsPage /> },
];