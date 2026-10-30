import { useState } from 'react';

import { Link } from 'react-router-dom';

import { MainContainer, PageContainer } from '../../Components/Containers';
import { TileButton } from '../../Components/Buttons';

export default function OfflineMenu() {
  return (
        <div className="flex gap-4">
          <Link to="/play/offline/quick">
          <TileButton>
            Quick
          </TileButton>
          </Link>
          <Link to="/play/offline/custom">
          <TileButton>
            Custom
          </TileButton>
          </Link>
          <Link to="/play/offline/commu">
          <TileButton>
            Communaute
          </TileButton>
          </Link>
        </div>
  );
}
