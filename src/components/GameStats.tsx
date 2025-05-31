
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, Zap, Target } from 'lucide-react';

interface GameRecord {
  id: string;
  player1: string;
  player2: string;
  winner: string;
  rounds: number;
  timestamp: Date;
  averageTime?: number;
}

interface GameStatsProps {
  gameHistory: GameRecord[];
  currentPlayer: string;
}

const GameStats = ({ gameHistory, currentPlayer }: GameStatsProps) => {
  const playerStats = gameHistory.reduce((stats, game) => {
    const isWinner = game.winner === currentPlayer;
    return {
      wins: stats.wins + (isWinner ? 1 : 0),
      losses: stats.losses + (isWinner ? 0 : 1),
      totalGames: stats.totalGames + 1,
      fastestTime: game.averageTime && (!stats.fastestTime || game.averageTime < stats.fastestTime) 
        ? game.averageTime : stats.fastestTime
    };
  }, { wins: 0, losses: 0, totalGames: 0, fastestTime: null as number | null });

  const winRate = playerStats.totalGames > 0 ? 
    Math.round((playerStats.wins / playerStats.totalGames) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Player Stats */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">{playerStats.wins}</div>
              <div className="text-xs text-white/75">Wins</div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-400">{playerStats.losses}</div>
              <div className="text-xs text-white/75">Losses</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-500/20 rounded-lg p-3">
              <div className="text-xl font-bold text-blue-400">{winRate}%</div>
              <div className="text-xs text-white/75">Win Rate</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-3">
              <div className="text-xl font-bold text-purple-400">
                {playerStats.fastestTime ? `${playerStats.fastestTime}ms` : '--'}
              </div>
              <div className="text-xs text-white/75">Best Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Games */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            Recent Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {gameHistory.length === 0 ? (
              <div className="text-white/50 text-center py-4">No games played yet</div>
            ) : (
              gameHistory.slice(-5).reverse().map((game) => (
                <div key={game.id} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="text-white text-sm font-medium">
                      {game.player1} vs {game.player2}
                    </div>
                    <div className="text-white/75 text-xs">
                      {game.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${
                    game.winner === currentPlayer ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {game.winner === currentPlayer ? 'WIN' : 'LOSS'}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameStats;
