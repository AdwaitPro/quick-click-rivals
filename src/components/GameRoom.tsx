
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Users, Zap, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';
import ReactionGame from './ReactionGame';

interface Player {
  id: string;
  name: string;
}

const GameRoom = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName] = useState(`Player ${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    // In a real app, this would connect to your backend
    // For demo purposes, we'll simulate the connection
    const mockSocket = {
      emit: (event: string, data: any) => {
        console.log('Emitting:', event, data);
      },
      on: (event: string, callback: (data: any) => void) => {
        console.log('Listening for:', event);
      },
      disconnect: () => {
        console.log('Disconnecting');
      }
    } as any;

    setSocket(mockSocket);

    // Simulate joining room
    setTimeout(() => {
      setPlayers([
        { id: '1', name: playerName },
        { id: '2', name: 'Player 456' } // Simulate second player
      ]);
    }, 1000);

    return () => {
      mockSocket.disconnect();
    };
  }, [roomCode, playerName]);

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      toast({
        title: "Room code copied!",
        description: "Share this code with your friend to join the game.",
      });
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (gameStarted) {
    return <ReactionGame socket={socket} roomCode={roomCode} playerName={playerName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center pb-6">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="absolute left-4 top-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Room: {roomCode}
          </CardTitle>
          <Button
            onClick={copyRoomCode}
            variant="ghost"
            className="text-blue-200 hover:text-white hover:bg-white/20"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Code
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-3">
                <Users className="w-5 h-5 inline mr-2" />
                Players ({players.length}/2)
              </h3>
              
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="p-3 bg-white/10 rounded-lg border border-white/20"
                  >
                    <span className="text-white font-medium">{player.name}</span>
                    {index === 0 && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        You
                      </span>
                    )}
                  </div>
                ))}
                
                {players.length < 2 && (
                  <div className="p-3 bg-white/5 rounded-lg border border-dashed border-white/30">
                    <span className="text-blue-300">Waiting for player...</span>
                  </div>
                )}
              </div>
            </div>
            
            {players.length === 2 ? (
              <Button
                onClick={startGame}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 transition-all duration-200 hover:scale-105"
              >
                Start Game!
              </Button>
            ) : (
              <div className="text-center text-blue-300">
                <div className="animate-pulse">Waiting for another player to join...</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameRoom;
