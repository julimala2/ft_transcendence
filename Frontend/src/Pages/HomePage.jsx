import { useEffect, useState } from 'react';

import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

import { MainContainer, PageContainer } from '../Components/Containers';
import { useAuth } from '../Hooks/useAuth';
import {StyledButton, TileButton} from '../Components/Buttons';
import { Logo } from '../Components/Logo';
import OfflineMenu from '../Quizs/Offline/OfflineMenu';




export function HomePage() {
  const { user } = useAuth();
  const [view,setView] = useState('main');
  const buttonStyle = "w-full h-full flex items-center justify-center gap-3.5 min-h-[140px] rounded-3xl \
    text-white text-3xl font-bold tracking-tight"
  const handleViewChange = (newView) => {
    setView(prevView => prevView === newView ? 'main' : newView);
  }

  return (
    <MainContainer>
      <PageContainer>
        <div className="flex flex-col gap-5 w-full items-center">
          <Logo />
          {user ? ( 
          <>
          <TileButton variant='menu' className='bg-linear-to-br from-red-500 to-red-800' 
          onClick={() => handleViewChange("offline")} 
          selected={view=="offline"}>
            <div
              className= {`${buttonStyle} `} >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"
                  fill="currentColor"
                />
              </svg>
              Solo
            </div>
          </TileButton>
          
          <AnimatePresence initial={false}>
            {view === 'offline' && (
              <motion.div
                key="offline-drawer"
                initial={{ height: 0, opacity: 0, padding: 0 }}
                animate={{ height: 'auto', opacity: 1, padding : 10 }}
                exit={{ height: 0, opacity: 0, padding : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="">
                  <OfflineMenu />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <TileButton variant='menu' className='bg-linear-to-br from-amber-400 to-amber-600'>
          <Link
            to="/quiz/online"
            className= {`${buttonStyle}`} >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"
                fill="currentColor"
                />
            </svg>
            Online
          </Link>
          </TileButton>

          <TileButton variant='menu' className='bg-linear-to-br from-blue-400 to-amber-300'>
          <Link
            to="/testpage"
            className= {`${buttonStyle}`} >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            </svg>
            Page de test
          </Link>
          </TileButton>
                    {/* Test Page TODO : a supp ! */}
          </>) : (
              <TileButton variant='menu' className='bg-linear-to-br  from-blue-400 to-green-600'>
                <Link 
                className={`${buttonStyle}`}
                state={{ backgroundLocation: location.pathname }}
                to="/account">
                Se connecter
                </Link>
              </TileButton>
          )}


        
      </div>
      </PageContainer>
    </MainContainer>
  );
}
