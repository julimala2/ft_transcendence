import { AccountProfile } from './AccountProfile';
import { AccountFriends } from './AccountFriends';
import { AccountSettings } from './AccountSettings';

export const accountTabs = [
  { path: 'profile',  label: 'Profil',     element: <AccountProfile /> },
  { path: 'friends',  label: 'Amis',       element: <AccountFriends /> },
  { path: 'settings', label: 'Paramètres', element: <AccountSettings /> },
  { path: 'stats', label: 'Statistiques', element: <></>}
];