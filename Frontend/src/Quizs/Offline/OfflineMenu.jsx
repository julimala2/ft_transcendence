
import { Link } from 'react-router-dom';
import { BlingButton } from '../../Components/Buttons';
import { TileButton } from '../../Components/Buttons';

export default function OfflineMenu() {
  const inner = "md:w-40! md:h-40 h-20 text-3xl!"

  return (
        <div className="flex gap-8 flex-col md:flex-row flex-1 flex-wrap w-full">
          <Link to="/play/offline/quick">
          <BlingButton innerClassName={inner}>
            Rush
          </BlingButton>
          </Link>
          <Link to="/play/offline/custom">
          <BlingButton innerClassName={inner}>
            Custom
          </BlingButton>
          </Link>
          <Link to="/play/offline/commu">
          <BlingButton innerClassName={inner}>
            Public
          </BlingButton>
          </Link>
        </div>
  );
}
