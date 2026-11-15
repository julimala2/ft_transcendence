import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MainContainer, PageContainer, StyledDiv } from '../Components/Containers';
import { useAuth } from '../Hooks/useAuth';
import {StyledButton, TileButton, BlingButton} from '../Components/Buttons';

export function HomePage() {
  const { user } = useAuth();
  const buttonStyle = "w-full h-full flex items-center justify-center gap-3.5 min-h-[140px] rounded-3xl \
    text-white text-3xl font-bold tracking-tight"

  return (
    <MainContainer>
      <PageContainer>
        <div className="flex flex-col gap-5 w-full items-center">
          <StyledDiv>
            <h1 className="font-[Slackey] text-4xl md:text-8xl text-center">
              <span className="text-amber-400">Q</span>
              <span className="text-red-400">u</span>
              <span className="text-blue-400">i</span>
              <span className="text-green-400">z</span>
              <span className="text-orange-400">G</span>
              <span className="text-emerald-400">a</span>
              <span className="text-slate-400">m</span>
              <span className="text-amber-400">e</span>
              <span className="text-red-400">!</span>
            </h1>
          </StyledDiv>
          {user ? ( 
          <>
          <BlingButton className='w-full md:w-150 p-2' innerClassName='h-30'>
            <Link
              to="/play/offline"
              className={`${buttonStyle}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"
                  fill="currentColor"
                />
              </svg>
              Solo
            </Link>
          </BlingButton>
          
          <BlingButton 
            className='w-full md:w-150 p-2'
            innerClassName='h-30'
            >
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
          </BlingButton>
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
