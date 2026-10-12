import { AccountProfile } from './AccountProfile';
import { SettingsPage } from '../Pages/SettingsPage';
import { AccountFriends } from './AccountFriends';

export const accountTabs = [
  { path: 'profile',  label: 'Profil',     element: <AccountProfile /> },
  { path: 'friends',  label: 'Amis',       element: <AccountFriends /> },
  { path: 'settings', label: 'Paramètres', element: <SettingsPage /> },
  { path: 'stats', label: 'Statistiques', element: <></>}
];