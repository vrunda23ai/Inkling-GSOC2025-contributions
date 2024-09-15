import { useEffect } from "react";

export type Draw = {
    ctx: CanvasRenderingContext2D;
    currentPoint: Point;
    prevPoint : null | Point;
}

export type DrawPoints = {
    currentPoint: Point;
    prevPoint : null | Point;
}

export type Point = {
    x:number;
    y:number;
}

import { useGameContext, GameContextType } from "../context/GameContext.tsx";
import { useCanvasContext, CanvasContextType } from "../context/CanvasContext.tsx";

const useDraw = (drawLine:({currentPoint, prevPoint}:DrawPoints)=>void , clearAllCanvas:()=>void) =>{
    
    // const { canvasRef, prevPoint, mouseDown, setMouseDown, isEditor } = useGameContext() as GameContextType;
    const { isEditor } = useGameContext() as GameContextType;
    const { canvasRef, prevPoint, mouseDown, setMouseDown } = useCanvasContext() as CanvasContextType;

    const onMouseDown =()=>{
        if(!isEditor) return;
        if(mouseDown) return;
        setMouseDown(true)
    }
    const mouseUphandler =()=>{
        if(!isEditor) return;
        if(!mouseDown) return;
        setMouseDown(false)
        prevPoint.current = null;
    }
    const clearCanvasForAll = () =>{
        const canvas = canvasRef.current;
        if(!canvas) return;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        clearAllCanvas();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const clearCanvas = () =>{
        const canvas = canvasRef.current;
        if(!canvas) return;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function onDraw({ctx, currentPoint, prevPoint}:Draw){
        const { x:currX, y:currY } = currentPoint;
        const lineColor = '#ffff';
        const lineWidth = 5;
    
        const startPoint = prevPoint ?? currentPoint;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.moveTo(startPoint.x , startPoint.y);
        ctx.lineTo(currX, currY);
        ctx.stroke();
    
        ctx.fillStyle = lineColor;
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, 2, 0, 2*Math.PI);
        ctx.fill();
    }

    useEffect(()=>{
        const mouseMovehandler =(e:MouseEvent)=>{
            if(!isEditor) return;
            if(!mouseDown) return;
            const currentPoint = computePointRelativeToCanvas(e);

            const ctx = canvasRef.current?.getContext('2d');
            if(!ctx || !currentPoint) return;

            onDraw({ctx, currentPoint, prevPoint:prevPoint.current});
            drawLine({currentPoint, prevPoint:prevPoint.current});
            prevPoint.current = currentPoint;
        }

        const computePointRelativeToCanvas = (e:MouseEvent) =>{
            const canvas = canvasRef.current;
            if(!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            return {x:x, y:y};
        }

        canvasRef.current?.addEventListener('mousemove', mouseMovehandler);
        window.addEventListener('mouseup', mouseUphandler);

        // effect cleanup function to remove event listener :
        return () => {
            window.removeEventListener('mouseup', mouseUphandler);
            canvasRef.current?.removeEventListener('mousemove', mouseMovehandler);
        }
    } , [onDraw])

    return{
        canvasRef,
        onMouseDown,
        clearCanvas,
        clearCanvasForAll
    }
}

export {
    useDraw
}