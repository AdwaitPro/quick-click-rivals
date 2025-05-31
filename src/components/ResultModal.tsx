
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, X, Clock, Zap } from 'lucide-react';

interface GameResult {
  winner: string;
  isFoul: boolean;
  responseTime?: number;
}

interface Scores {
  player1: number;
  player2: number;
}

interface ResultModalProps {
  result: GameResult;
  scores: Scores;
  currentRound: number;
  isGameOver: boolean;
  onNextRound: () => void;
  onClose: () => void;
}

const ResultModal = ({ 
  result, 
  scores, 
  currentRound, 
  isGameOver, 
  onNextRound, 
  onClose 
}: ResultModalProps) => {
  const isWinner = result.winner !== 'Opponent';
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm bg-white/10 backdrop-blur-lg border-white/20 animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {result.isFoul ? (
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                <X className="w-8 h-8 text-white" />
              </div>
            ) : isWinner ? (
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            ) : (
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <Zap className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold text-white">
            {isGameOver ? 'Game Over!' : `Round ${currentRound} Result`}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            {result.isFoul ? (
              <div>
                <div className="text-red-400 text-xl font-bold mb-2">Foul!</div>
                <div className="text-white/75">You clicked too early</div>
                <div className="text-white/75">Point goes to opponent</div>
              </div>
            ) : isWinner ? (
              <div>
                <div className="text-green-400 text-xl font-bold mb-2">You Won!</div>
                {result.responseTime && (
                  <div className="text-white/75 flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {result.responseTime}ms reaction time
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-blue-400 text-xl font-bold mb-2">Opponent Won!</div>
                <div className="text-white/75">Better luck next round</div>
              </div>
            )}
          </div>
          
          {/* Score Display */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-center text-white/75 text-sm mb-2">Current Score</div>
            <div className="flex justify-between items-center text-white">
              <div className="text-center">
                <div className="text-sm opacity-75">You</div>
                <div className="text-2xl font-bold">{scores.player1}</div>
              </div>
              <div className="text-white/50">-</div>
              <div className="text-center">
                <div className="text-sm opacity-75">Opponent</div>
                <div className="text-2xl font-bold">{scores.player2}</div>
              </div>
            </div>
          </div>
          
          {isGameOver ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className={`text-xl font-bold ${
                  scores.player1 > scores.player2 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {scores.player1 > scores.player2 ? 'Victory!' : 'Defeat!'}
                </div>
                <div className="text-white/75 text-sm">
                  {scores.player1 > scores.player2 ? 'You won the match!' : 'Better luck next time!'}
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-200 hover:scale-105"
              >
                New Game
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => {
                onClose();
                onNextRound();
              }}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 transition-all duration-200 hover:scale-105"
            >
              Next Round
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultModal;
