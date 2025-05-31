
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Gamepad2 } from 'lucide-react';

interface PlayerSetupProps {
  onSetupComplete: (player1Name: string, player2Name: string) => void;
  defaultPlayer1?: string;
}

const PlayerSetup = ({ onSetupComplete, defaultPlayer1 = '' }: PlayerSetupProps) => {
  const [player1Name, setPlayer1Name] = useState(defaultPlayer1);
  const [player2Name, setPlayer2Name] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1Name.trim() && player2Name.trim()) {
      onSetupComplete(player1Name.trim(), player2Name.trim());
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Player Setup
        </CardTitle>
        <p className="text-blue-200">Enter player names to start the duel!</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                type="text"
                placeholder="Player 1 Name"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                className="pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-blue-300"
                maxLength={20}
                required
              />
            </div>
            
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300" />
              <Input
                type="text"
                placeholder="Player 2 Name (Opponent)"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-purple-300"
                maxLength={20}
                required
              />
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={!player1Name.trim() || !player2Name.trim()}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            Start Game!
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerSetup;
