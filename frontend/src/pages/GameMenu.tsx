import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { useSocket, roomCode } from "../hooks/useSocket.ts";

function GameMenu() {

  const { createSocketConnection, createRoom, joinRoom, generateWord, startcountdown } = useSocket();
  const navigate = useNavigate();

  async function initiateSocketConnectionCreateRoom (){
    createSocketConnection();
    const roomcode:roomCode = await createRoom();
    if(!roomcode.error){
      setTimeout(async()=>{
        await generateWord();
      }, 5000);
      (async()=>{
        await startcountdown();
      })()
      navigate('/game');
    }
  }

  async function initiateSocketConnectionJoinRoom (){
    const roomIdInput = document.getElementById('codeinput') as HTMLInputElement;
    const roomId = roomIdInput.value;
    createSocketConnection();
    const roomcode:roomCode = await joinRoom(roomId);
    if(!roomcode.error){
      navigate('/game');
    }
  }

  return (
    <div className="flex-grow flex justify-center items-center flex-col h-full w-full">
    <Tabs defaultValue="join" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="join">Join Room</TabsTrigger>
        <TabsTrigger value="create">Create Room</TabsTrigger>
      </TabsList>
      <TabsContent value="join">
        <Card>
          <CardHeader>
            <CardTitle>Join Room</CardTitle>
            <CardDescription>
              Enter Secret Code of Room.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <div className="flex w-full justify-between items-center">
              <Input className='mr-4' id="codeinput" placeholder="Room Code" />
              <Button onClick={initiateSocketConnectionJoinRoom}>Join Room</Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create Room</CardTitle>
            <CardDescription>
              Create a new Room.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <div className="grid grid-cols-2">
              <Button onClick={initiateSocketConnectionCreateRoom}>Create Room</Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )
}

export default memo(GameMenu)