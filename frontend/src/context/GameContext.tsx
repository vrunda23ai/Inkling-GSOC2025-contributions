import { createContext, useContext, useState, useMemo, ReactNode } from "react";

export type player = {
    username: string;
    profilePic: string;
    score: number;
    socketId: string;
    _id: string;
}

export type gameResponse = {
    creator?: string;
    secretcode?: string;
    players?: [player];
    error?: string;
}

type words = [string] | undefined

export type GameContextType = {
    gameDetails: gameResponse | undefined;
    isEditor: boolean;
    setIsEditor: (newValue: boolean) => void;
    setGameDetails: (newValue: gameResponse | undefined) => void;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    words: [string] | undefined;
    setWords: (words: words) => void;
}
type ContextProps = {
    children: ReactNode;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function GameContextProvider({ children }: ContextProps) {

    const [gameDetails, setGameDetails] = useState<gameResponse | undefined>(undefined);
    const [isEditor, setIsEditor] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [words, setWords] = useState<words>(undefined);

    const gameDetailsMemo = useMemo(
        () => (gameDetails),[gameDetails]
    );

    return (
        <GameContext.Provider value={{
            gameDetails:gameDetailsMemo,
            isEditor,
            openDialog,
            words,
            setGameDetails,
            setIsEditor,
            setOpenDialog,
            setWords,
        }}>
            {children}
        </GameContext.Provider>
    )
}

function useGameContext() {
    return useContext(GameContext);
}

export {
    GameContext,
    GameContextProvider,
    useGameContext
}