import { useState } from "react";
import { Link } from "react-router-dom";
import { MainContainer, PageContainer } from "../../Components/Containers";

export default function OfflineMenu() {
    return (
        <MainContainer>
            <PageContainer>
                <div className="flex gap-4">
                    <Link to="/play/offline/quick">
                        <div className="flex items-center text-3xl font-bold justify-center w-50 h-50 rounded-md bg-gradient-to-tr from-amber-600 to-amber-400">
                            <h1>Quick</h1>
                        </div>
                    </Link>
                    <Link to="/play/offline/custom">
                        <div className="flex items-center text-3xl font-bold justify-center w-50 h-50 rounded-md bg-gradient-to-tr from-blue-600 to-purple-400">
                            <h1>Custom</h1>
                        </div>
                    </Link>
                    <Link to="/play/offline/commu">
                        <div className="flex items-center text-3xl font-bold justify-center w-50 h-50 rounded-md bg-gradient-to-tr from-green-600 to-emerald-400">
                            <h1>Commu</h1>
                        </div>
                    </Link>
                </div>
            </PageContainer>
        </MainContainer>
    );
}