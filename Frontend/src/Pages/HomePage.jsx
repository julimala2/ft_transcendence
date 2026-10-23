import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { MainContainer,PageContainer } from '../Components/Containers';

export function HomePage() {
    const { user } = useAuth();

    return (
        <MainContainer>
            <PageContainer>
            <div className="flex flex-col gap-10 w-150">
                {/* Solo Play Button */}
                <Link 
                    to="/play/offline/menu" 
                    className="flex items-center justify-center gap-3.5 min-h-[140px] rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-white text-3xl font-bold tracking-tight shadow-[0_16px_40px_rgba(124,92,255,0.45)] transition-transform duration-150 hover:shadow-[0_20px_50px_rgba(124,92,255,0.6)] active:scale-98"
                    >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" fill="currentColor" />
                    </svg>
                    Solo
                </Link>
                
                {/* Online Play Button */}
                <Link 
                    to="/game/1" 
                    className="flex items-center justify-center gap-3.5 min-h-[140px] rounded-2xl bg-gradient-to-r from-red-500 to-red-400 text-white text-3xl font-bold tracking-tight shadow-[0_16px_40px_rgba(84,90,255,0.45)] transition-transform duration-150 hover:shadow-[0_20px_50px_rgba(124,92,255,0.6)] active:scale-98"
                    >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" fill="currentColor" />
                    </svg>
                    Online
                </Link>
            </div>
            </PageContainer>
        </MainContainer>
    );
}
