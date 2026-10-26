import { useState } from 'react';

import { Link, Navigate } from 'react-router-dom';

import { MainContainer, PageContainer } from '../Components/Containers';
import { useAuth } from '../Hooks/useAuth';
import {StyledButton, TileButton} from '../Components/Buttons'

export function HomePage() {
  const { user } = useAuth();
  const buttonStyle = "w-full h-full flex items-center justify-center gap-3.5 min-h-[140px] rounded-3xl \
    text-white text-3xl font-bold tracking-tight"

  return (
    <MainContainer>
      <PageContainer>
        <div className="flex flex-col gap-10 w-150">
          {user ? ( 
          <>
          <TileButton variant='menu' className='bg-linear-to-br from-red-500 to-red-800'>
            <Link
              to="/play/offline/menu"
              className= {`${buttonStyle} `} >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"
                  fill="currentColor"
                />
              </svg>
              Solo
            </Link>
          </TileButton>
          <TileButton variant='menu' className='bg-linear-to-br from-amber-400 to-amber-600'>
          <Link
            to="/game/1"
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
          </>) : (
              <TileButton variant='menu' className='bg-linear-to-br  from-amber-400 to-amber-600'>
                <Link 
                state={{ backgroundLocation: location.pathname }}
                to="/account">
                Bonjour
                </Link>
              </TileButton>
          )}

          {/* Test Page */}
          <Link
            to="/testpage"
            className="w-full h-full flex items-center justify-center gap-3.5 min-h-[140px] rounded-2xl bg-gradient-to-r from-blue-500 to-yellow-400 text-white text-3xl font-bold tracking-tight shadow-[0_16px_40px_rgba(84,90,255,0.45)] transition-transform duration-150 hover:shadow-[0_20px_50px_rgba(124,92,255,0.6)] active:scale-98"
            >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"
                fill="currentColor"
                />
            </svg>
            Test
          </Link>
        
      </div>
      </PageContainer>
    </MainContainer>
  );
}
