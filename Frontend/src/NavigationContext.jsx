//Le contexte permet de passer des funcs a tout les composants sans avoir a faire les declarations (ce qui est chiant)
import { createContext, useContext } from "react";

export const NavigationContext = createContext(null);

export function useNavigation() {
    return useContext(NavigationContext);
}