import { createContext, useContext, useRef, useState, ReactNode } from "react";

type Point = { x: number; y: number };

export type CanvasContextType = {
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    prevPoint: React.MutableRefObject<Point | null>;
    mouseDown: boolean;
    setMouseDown: (newValue: boolean) => void;
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: ReactNode }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const prevPoint = useRef<Point | null>(null);
    const [mouseDown, setMouseDown] = useState(false);

    return (
        <CanvasContext.Provider value={{ canvasRef, prevPoint, mouseDown, setMouseDown }}>
            {children}
        </CanvasContext.Provider>
    );
}

export function useCanvasContext() {
    const context = useContext(CanvasContext);
    if (!context) {
        throw new Error("useCanvasContext must be used within a CanvasProvider");
    }
    return context;
}
