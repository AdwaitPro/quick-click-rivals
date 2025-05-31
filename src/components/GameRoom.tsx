
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Users, Zap, ArrowLeft, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';
import ReactionGame from './ReactionGame';
import PlayerSetup from './PlayerSetup';
import GameStats from './GameStats';

interface Player {
  id: string;
  name: string;
}

interface GameRecord {
  id: string;
  player1: string;
  player2: string;
  winner: string;
  rounds: number;
  timestamp: Date;
  averageTime?: number;
}

const GameRoom = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);

  useEffect(() => {
    // Load game history from localStorage
    const savedHistory = localStorage.getItem('reactionDuelHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setGameHistory(parsed.map((game: any) => ({
        ...game,
        timestamp: new Date(game.timestamp)
      })));
    }

    // Mock socket setup
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

    return () => {
      mockSocket.disconnect();
    };
  }, [roomCode]);

  const handleSetupComplete = (p1Name: string, p2Name: string) => {
    setPlayer1Name(p1Name);
    setPlayer2Name(p2Name);
    setPlayers([
      { id: '1', name: p1Name },
      { id: '2', name: p2Name }
    ]);
    setShowSetup(false);
  };

  const handleGameComplete = (winner: string, rounds: number, averageTime?: number) => {
    const newGame: GameRecord = {
      id: Date.now().toString(),
      player1: player1Name,
      player2: player2Name,
      winner,
      rounds,
      timestamp: new Date(),
      averageTime
    };

    const updatedHistory = [...gameHistory, newGame];
    setGameHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem('reactionDuelHistory', JSON.stringify(updatedHistory));
    
    toast({
      title: "Game Complete!",
      description: `${winner} wins! Game saved to history.`,
    });
  };

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
    return (
      <ReactionGame 
        socket={socket} 
        roomCode={roomCode} 
        player1Name={player1Name}
        player2Name={player2Name}
        onGameComplete={handleGameComplete}
      />
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="relative z-10">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="absolute -top-16 left-0 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <PlayerSetup 
            onSetupComplete={handleSetupComplete}
            defaultPlayer1={`Player ${Math.floor(Math.random() * 1000)}`}
          />
        </div>
      </div>
    );
  }

  if (showStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="w-full max-w-md relative z-10">
          <Button
            onClick={() => setShowStats(false)}
            variant="ghost"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Room
          </Button>
          
          <GameStats gameHistory={gameHistory} currentPlayer={player1Name} />
        </div>
      </div>
    );
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
          
          <Button
            onClick={() => setShowStats(true)}
            variant="ghost"
            className="absolute right-4 top-4 text-white hover:bg-white/20"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
          
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse">
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
                Players Ready ({players.length}/2)
              </h3>
              
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="p-3 bg-white/10 rounded-lg border border-white/20 flex items-center justify-between"
                  >
                    <span className="text-white font-medium">{player.name}</span>
                    <div className="flex items-center space-x-2">
                      {index === 0 && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                          You
                        </span>
                      )}
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              onClick={startGame}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 transition-all duration-200 hover:scale-105 animate-pulse-glow"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Reaction Duel!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameRoom;
