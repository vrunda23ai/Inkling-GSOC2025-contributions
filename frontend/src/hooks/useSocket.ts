// import { useRef } from "react";
import { toast } from "sonner";
import { date } from "../utils/date.ts";
import { io, Socket } from 'socket.io-client';
import { z } from 'zod';

import { useAuthContext, AuthContextType } from "../context/AuthContext.tsx";
import { gameResponse, useGameContext, GameContextType } from "../context/GameContext.tsx";
import { useDraw, DrawPoints, Draw } from "./useDraw.ts";

export type roomCode = {
    error?: string;
    code?: string;
};

export type CardDetails = {
    error?: string;
    success?: string;
}

export type errorMessage = {
    error?: string;
}

export type guessResponse = {
    ok?: boolean;
    error?: string;
}

// declare persistant variable here as everytime useSocket hook is called
// we want to persist data in a variable and not redeclare them.
let socket: Socket;
let joinRoomCode: string | undefined;
let flag2 = 0;
const roomIdSchema = z.string().uuid({message: "Invalid Join Room Code"});
const wordSchema = z.string({message: "Enter valid word"});

function useSocket() {

    const { authUser } = useAuthContext() as AuthContextType;
    const { setGameDetails, setOpenDialog, setWords, setIsEditor, isEditor } = useGameContext() as GameContextType;
    const { clearCanvas, canvasRef } = useDraw(drawLine, clearAllCanvas);

    const createSocketConnection = () => {
        if (socket) return;   // Prevent re-initialization
        socket = io('http://localhost:3000', {
            withCredentials: true // to pass cookies to socket
        });

        socket.on("notification", message => {
            const { dateString } = date();
            toast(message, {
                description: dateString
            });
        })

        socket.on("update-gameDetails", gameData => {
            setGameDetails(gameData);
        })

        let flag1 = 0;
        socket.on("countdown", time => {
            const counterbody = document.getElementById('counterbody') as HTMLDivElement;
            const drawarea = document.getElementById('drawarea') as HTMLDivElement;
            function showhide(){
                const counterbody = document.getElementById('counterbody') as HTMLDivElement;
                counterbody.style.display = 'block';
                drawarea.style.display = 'none';
                flag1 = 1;
            }
            if(flag1 == 0){showhide()}

            if (time > 0) {
                const counterInput = document.getElementById('counter') as HTMLSpanElement;
                counterInput.innerHTML = (time).toString();
            } else {
                counterbody.style.display = 'none';
                drawarea.style.display = 'block';
                const b1w = document.getElementById('drawarea')?.offsetWidth;
                const b1h = document.getElementById('drawarea')?.offsetHeight;
                const canvas = document.getElementById('canvasarea') as HTMLCanvasElement;
                if (b1w && b1h) {
                    canvas.width = b1w; 
                    canvas.height = b1h - 50;
                }
                flag1 = 0;
            }
        });

        socket.on("roundtimer", async(time) => {
            const timer = document.getElementById('timer') as HTMLHeadingElement;
            const counterbody = document.getElementById('counterbody') as HTMLDivElement;
            const drawarea = document.getElementById('drawarea') as HTMLDivElement;
            const seconds = document.getElementById('seconds') as HTMLSpanElement;
            function showhide(){
                timer.style.display = 'block';
                counterbody.style.display = 'none';
                drawarea.style.display = 'block';
                const b1w = document.getElementById('drawarea')?.offsetWidth;
                const b1h = document.getElementById('drawarea')?.offsetHeight;
                const canvas = document.getElementById('canvasarea') as HTMLCanvasElement;
                if (b1w && b1h) {
                    canvas.width = b1w; 
                    canvas.height = b1h - 50;
                }
                flag2 = 1;
            }
            if(flag2 == 0){showhide()}
            
            if (time > 0) {
                seconds.innerHTML = (time).toString();
            } else {
                setIsEditor(false);
                timer.style.display = 'none';
                seconds.innerHTML = '120';
                const drawarea = document.getElementById('drawarea') as HTMLDivElement;
                drawarea.style.display = 'none';
                clearCanvas();
                flag2 = 0;
            }
        });

        socket.on('draw-line', ({prevPoint, currentPoint}:DrawPoints)=>{
            const canvas = canvasRef.current;
            if(!canvas){
                return;
            }
    
            const ctx = canvas.getContext('2d');
            if(!ctx){
                return;
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
            onDraw({ctx, currentPoint, prevPoint});
        })

        socket.on("clear-canvas", () => {
            clearCanvas();
        })

        socket.on("select-word", gameData => {
            setWords(gameData);
            setOpenDialog(true);
        })

        socket.on("correct-guess", message => {
            setIsEditor(false);
            const { dateString } = date();
            toast(message, {
                description: dateString
            });
        })

        window.addEventListener('beforeunload', () => {
            if (socket)
                socket.emit('leave-game', joinRoomCode);
        });

        socket.on("connect_error", err => {
            if (err.message === 'xhr poll error') {
                const { dateString } = date();
                toast(`Failed : Server Connection Error`, {
                    description: dateString
                });
                socket?.disconnect();
            }
            const { dateString } = date();
            toast(`Failed : ${err.message}`, {
                description: dateString
            });
        });
    }

    const createRoom = (): Promise<roomCode> => {
        return new Promise((resolve) => {
            if (!socket) {
                resolve({ error: "No socket connection" });
                return;
            }

            if (authUser === undefined) {
                const { dateString } = date();
                toast(`Failed to Create Room : Login first`, {
                    description: dateString
                });
                resolve({ error: "No Auth User" });
                return;
            }

            socket.emit('create-room', authUser.username, authUser.profilePic, (res: gameResponse) => {
                if (res.error) {
                    const { dateString } = date();
                    toast(`Failed to Create Room : ${res.error}`, {
                        description: dateString
                    });
                    resolve({ error: res.error });
                }
                else {
                    const { dateString } = date();
                    toast(`Room Code : ${res.secretcode}`, {
                        description: dateString
                    });
                    setGameDetails(res);
                    joinRoomCode = res.secretcode;
                    resolve({ code: res.secretcode });
                }
            })
        })
    };

    const joinRoom = (roomId: string): Promise<roomCode> => {
        return new Promise((resolve) => {
            if (!socket) {
                resolve({ error: "No socket connection" });
                return;
            }

            if (authUser === undefined) {
                const { dateString } = date();
                toast(`Failed to Create Room : Login first`, {
                    description: dateString
                });
                resolve({ error: "No Auth User" });
                return;
            }

            const zodResults = roomIdSchema.safeParse(roomId);
            if(!zodResults.success){
                const { dateString } = date();
                toast(`Failed to Create Room : ${zodResults.error.format()._errors[0]}`, {
                    description: dateString
                });
                resolve({ error: `${zodResults.error.format()._errors[0]}` });
                return;
            }

            socket.emit('join-room', authUser.username, authUser.profilePic, roomId, (res: gameResponse) => {
                if (res.error) {
                    const { dateString } = date();
                    toast(`Failed to Create Room : ${res.error}`, {
                        description: dateString
                    });
                    resolve({ error: res.error });
                }
                else {
                    const { dateString } = date();
                    toast(`Room Code : ${res.secretcode}`, {
                        description: dateString
                    });
                    setGameDetails(res);
                    joinRoomCode = res.secretcode;
                    resolve({ code: res.secretcode });
                }
            })
        })
    };

    const startcountdown = (): Promise<errorMessage> => {
        return new Promise((resolve) => {
            if (!socket) {
                resolve({ error: "No socket connection" });
                return;
            }

            if (authUser === undefined) {
                const { dateString } = date();
                toast(`Failed to Start countdown : Login first`, {
                    description: dateString
                });
                resolve({ error: "No Auth User" });
                return;
            }

            socket.emit('start-countdown', joinRoomCode);
            resolve({})
        })
    };

    const generateWord = (): Promise<errorMessage> => {
        return new Promise((resolve) => {
            if (!socket) {
                resolve({ error: "No socket connection" });
                return;
            }

            if (authUser === undefined) {
                const { dateString } = date();
                toast(`Failed to Start game : Login first`, {
                    description: dateString
                });
                resolve({ error: "No Auth User" });
                return;
            }

            socket.emit('generate-word', joinRoomCode);
            resolve({})
        })
    };

    const selectedWord = (word: string): Promise<errorMessage> => {
        return new Promise((resolve) => {
            if (!socket) {
                resolve({ error: "No socket connection" });
                return;
            }

            if (authUser === undefined) {
                const { dateString } = date();
                toast(`Failed to Start game : Login first`, {
                    description: dateString
                });
                resolve({ error: "No Auth User" });
                return;
            }

            socket.emit('selected-word', word, joinRoomCode, (res: errorMessage) => {
                if (res.error) {
                    const { dateString } = date();
                    toast(`Failed to generate word : ${res.error}`, {
                        description: dateString
                    });
                    setOpenDialog(false);
                    return ({ error: res.error });
                }
                else {
                    setIsEditor(true);
                    const { dateString } = date();
                    toast(`Start to draw word: ${word}`, {
                        description: dateString
                    });
                    setOpenDialog(false);
                    socket.emit('start-round-timer', joinRoomCode);
                    return ({});
                }
            })
            return ({})
        })
    };

    const submitGuess = (word: string): Promise<guessResponse> => {
        return new Promise((resolve) => {
            if (!socket) {
                resolve({ error: "No socket connection" });
                return;
            }

            if (authUser === undefined) {
                const { dateString } = date();
                toast(`Failed to submit guess : Login first`, {
                    description: dateString
                });
                resolve({ error: "No Auth User" });
                return;
            }

            const zodResults = wordSchema.safeParse(word);
            if(!zodResults.success){
                const { dateString } = date();
                toast(`Failed to submit word : ${zodResults.error.format()._errors[0]}`, {
                    description: dateString
                });
                resolve({ error: `${zodResults.error.format()._errors[0]}` });
                return;
            }

            if (isEditor === true) {
                const { dateString } = date();
                toast(`You are drawing: Submit guess denied`, {
                    description: dateString
                });
                resolve({ error: "You are drawing" });
                return;
            }

            socket.emit('submit-guess', word, joinRoomCode, authUser.username, (res: guessResponse) => {
                if (res.error) {
                    const { dateString } = date();
                    toast(`Error Rejoin please: ${res.error}`, {
                        description: dateString
                    });
                    return ({ error: res.error });
                }
                else {
                    if (!res.ok) {
                        const { dateString } = date();
                        toast(`Wrong guess: ${word}`, {
                            description: dateString
                        });
                    }
                    else {
                        const seconds = document.getElementById('seconds') as HTMLSpanElement;
                        seconds.innerHTML = '120';
                        clearCanvas();
                    }
                    return (res);
                }
            })
            return ({})
        })
    };

    function drawLine({currentPoint, prevPoint}:DrawPoints){
        if (!socket) {
            return;
        }

        if (authUser === undefined) {
            const { dateString } = date();
            toast(`Failed to submit guess : Login first`, {
                description: dateString
            });
            return;
        }

        socket.emit('draw-line', currentPoint, prevPoint, joinRoomCode);
    }

    function clearAllCanvas(){
        if (!socket) {
            return;
        }

        if (authUser === undefined) {
            const { dateString } = date();
            toast(`Failed to submit guess : Login first`, {
                description: dateString
            });
            return;
        }

        socket.emit('clear-canvas', joinRoomCode);
    }

    const leaveGame = () => {
        if (!socket) return;
        
        if(isEditor){
            socket.emit('editor-leave-game', joinRoomCode);
        }
        else{
            socket.emit('leave-game', joinRoomCode);
        }

        setIsEditor(false);
        setGameDetails(undefined);
        flag2 = 0;
    }

    const returnCode = () => {
        if (!socket) {
            return undefined;
        }
        return joinRoomCode;
    }

    return {
        createSocketConnection,
        createRoom,
        joinRoom,
        startcountdown,
        generateWord,
        selectedWord,
        submitGuess,
        drawLine,
        clearAllCanvas,
        leaveGame,
        returnCode
    }
}

const DAIICTidSchema = z.number({ message: "Invalid id" }).refine((id) => {
    return id.toString().length === 9;
}, {
    message: "ID must be 9 digits long"
});
const sendDAIICTid = (DAIICTid: number): Promise<CardDetails> => {
    return new Promise((resolve) => {
        
        const zodResults = DAIICTidSchema.safeParse(DAIICTid);
        if(!zodResults.success){
            resolve({error:`U F*cked up !! Follow Readme and try again : ${zodResults.error.format()._errors[0]}`});
            return;
        } else {
            resolve({success:`U pass, commit and create a pull request !!!`});
            return;
        }
    })
};

export {
    useSocket,
    sendDAIICTid
}