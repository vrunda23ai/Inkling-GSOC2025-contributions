import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { TrophyIcon, UsersIcon } from "../components/Icons.tsx";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useGameContext, GameContextType } from "../context/GameContext.tsx";
import { useAuthContext, AuthContextType } from "../context/AuthContext.tsx";
import { useSocket, errorMessage, guessResponse } from '../hooks/useSocket.ts';
import { useDraw } from '../hooks/useDraw.ts';

function Game() {

  const { gameDetails, openDialog, setOpenDialog, words, isEditor } = useGameContext() as GameContextType;
  const { authUser } = useAuthContext() as AuthContextType;
  const navigate = useNavigate();
  const { selectedWord, submitGuess, drawLine, clearAllCanvas, leaveGame } = useSocket();
  
  const { canvasRef, onMouseDown, clearCanvasForAll } = useDraw(drawLine, clearAllCanvas);

  useEffect(() => {
    if (gameDetails?.secretcode === undefined) {
      navigate('/game');
    }
  }, []);

  async function sendSelectedWord(word:string){
    // console.log(word);
    const res:errorMessage = await selectedWord(word);
    if(res.error) {
      return;
    }
  }

  async function sendSubmitGuess(){
    const wordInput = document.getElementById('guess') as HTMLInputElement;
    const word = wordInput.value;
    const res:guessResponse = await submitGuess(word);
    if(res.error) {
      return;
    }
  }


  return (
    <div className="flex-grow flex flex-col justify-between h-full w-full">
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        {/* <Button onClick={()=>{setOpenDialog(!openDialog)}}>Show</Button> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select a word to draw</AlertDialogTitle>
            <AlertDialogDescription>
              {
                words?.map((word)=>{
                  return(
                    <>
                      <Button onClick={()=>{sendSelectedWord(word)}} variant={'link'} className='text-primary mr-4 cursor-pointer underline-offset-4 hover:underline'>{word}</Button>
                    </>
                  )
                })
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      <main className="flex-grow bg-background text-foreground pt-4 pl-8 pr-8 pb-4">
        <div className="w-full h-full grid grid-cols-4 gap-8">
          <div className="bg-card rounded-lg shadow p-6 col-span-3">
            <div className='flex justify-between items-center'>
              <div className='w-full'>
                <h2 className="text-xl font-bold mb-4">Drawing Canvas</h2>
              </div>
              <div className="w-full text-xl font-bold mb-4">
                <div id='timer' className="hidden w-full">
                  <div className='flex justify-end w-full pl-[100px]'>
                    <h2>Time left: <span id='seconds'>120</span>s</h2>
                    {
                      isEditor 
                      ? <Button className='ml-10' onClick={clearCanvasForAll}>Clear Canvas</Button>
                      : <></>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center w-full h-full">
              <div id='counterbody' className='hidden'>
                Next word comming in: <span id='counter'>20</span> 
              </div>
              <div id='drawarea' className='flex justify-center items-center w-full h-full'>
                <canvas 
                  onMouseDown={onMouseDown} 
                  id="canvasarea" 
                  ref={canvasRef} 
                  className='border border-white rounded-md' 
                />
              </div>
            </div>
          </div>
          <div className="bg-card flex flex-col justify-between rounded-lg shadow p-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Guesses</h2>
              <div className="space-y-4 overflow-y-auto">
                {
                  gameDetails?.players?.map((player) => {
                    return (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={player.profilePic} />
                            <AvatarFallback>DJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{player.username}</p>
                            <p className="text-muted-foreground text-sm">Score :{player.score}</p>
                          </div>
                        </div>
                        {/* <Badge variant="outline">Correct</Badge> */}
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className='pt-2 rounded-lg'>
              <div className="flex w-full justify-between items-center">
                {
                  isEditor ? <></> : <>
                    <Input className='mr-4' id="guess" placeholder="your guess ...." />
                    <Button onClick={()=>{sendSubmitGuess()}}>Send</Button>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-card text-foreground p-4 shadow">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              <span>00:45</span>
            </div> */}
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5" />
              <span>Score: {(gameDetails?.players?.find(obj => obj.username == authUser?.username))?.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              <span>{gameDetails?.players?.length}/8</span>
            </div>
          </div>
          <div>
            <p className='text-xl'><span className='font-bold'>Room Code: </span>{gameDetails?.secretcode}</p>
          </div>
          <Button onClick={()=>{leaveGame()}} className='font-medium text-xl' variant="link" >Leave Game</Button>
        </div>
      </footer>
    </div>
  )
}

export default memo(Game)