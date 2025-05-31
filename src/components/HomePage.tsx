
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Users, Trophy } from 'lucide-react';

const HomePage = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${newRoomCode}`);
  };

  const joinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Reaction Duel
          </CardTitle>
          <p className="text-blue-200">
            Challenge a friend to the ultimate reaction game!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button
              onClick={createRoom}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 transition-all duration-200 hover:scale-105"
            >
              <Users className="w-5 h-5 mr-2" />
              Create Room
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-blue-200">or</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="h-12 text-center text-lg font-mono bg-white/10 border-white/30 text-white placeholder:text-blue-300"
                maxLength={6}
              />
              <Button
                onClick={joinRoom}
                disabled={!roomCode.trim()}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Join Room
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
