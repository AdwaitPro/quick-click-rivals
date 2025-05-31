
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, X, Clock, Zap, Star, Crown } from 'lucide-react';

interface GameResult {
  winner: string;
  isFoul: boolean;
  responseTime?: number;
  isPerfect?: boolean;
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
  player1Name: string;
  player2Name: string;
  onNextRound: () => void;
  onClose: () => void;
}

const ResultModal = ({ 
  result, 
  scores, 
  currentRound, 
  isGameOver, 
  player1Name,
  player2Name,
  onNextRound, 
  onClose 
}: ResultModalProps) => {
  const isPlayer1Winner = result.winner === player1Name;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm bg-white/10 backdrop-blur-lg border-white/20 animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {result.isFoul ? (
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce">
                <X className="w-8 h-8 text-white" />
              </div>
            ) : result.isPerfect ? (
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-spin">
                <Star className="w-8 h-8 text-white" />
              </div>
            ) : isPlayer1Winner ? (
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            ) : (
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <Zap className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold text-white">
            {isGameOver ? (
              <div className="flex items-center justify-center">
                <Crown className="w-6 h-6 mr-2 text-yellow-400" />
                Game Over!
              </div>
            ) : (
              `Round ${currentRound} Result`
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            {result.isFoul ? (
              <div>
                <div className="text-red-400 text-xl font-bold mb-2">Foul!</div>
                <div className="text-white/75">{player1Name} clicked too early</div>
                <div className="text-white/75">Point goes to {player2Name}</div>
              </div>
            ) : result.isPerfect ? (
              <div>
                <div className="text-yellow-400 text-xl font-bold mb-2 animate-pulse">PERFECT REACTION!</div>
                <div className="text-white/75">{result.winner} wins with</div>
                {result.responseTime && (
                  <div className="text-green-400 font-bold flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {result.responseTime}ms - Lightning Speed!
                  </div>
                )}
              </div>
            ) : isPlayer1Winner ? (
              <div>
                <div className="text-green-400 text-xl font-bold mb-2">{player1Name} Won!</div>
                {result.responseTime && (
                  <div className="text-white/75 flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {result.responseTime}ms reaction time
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-blue-400 text-xl font-bold mb-2">{player2Name} Won!</div>
                <div className="text-white/75">Better luck next round</div>
              </div>
            )}
          </div>
          
          {/* Enhanced Score Display */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-center text-white/75 text-sm mb-2">Match Score</div>
            <div className="flex justify-between items-center text-white">
              <div className="text-center">
                <div className="text-sm opacity-75">{player1Name}</div>
                <div className={`text-2xl font-bold ${scores.player1 > scores.player2 ? 'text-green-400' : ''}`}>
                  {scores.player1}
                </div>
              </div>
              <div className="text-white/50">-</div>
              <div className="text-center">
                <div className="text-sm opacity-75">{player2Name}</div>
                <div className={`text-2xl font-bold ${scores.player2 > scores.player1 ? 'text-green-400' : ''}`}>
                  {scores.player2}
                </div>
              </div>
            </div>
          </div>
          
          {isGameOver ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className={`text-xl font-bold ${
                  scores.player1 > scores.player2 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {scores.player1 > scores.player2 ? `${player1Name} Wins!` : `${player2Name} Wins!`}
                </div>
                <div className="text-white/75 text-sm">
                  {scores.player1 > scores.player2 ? 'Congratulations on your victory!' : 'Better luck next time!'}
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-200 hover:scale-105"
              >
                Play Again
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
