
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Trophy, X, Clock } from 'lucide-react';
import ResultModal from './ResultModal';

interface ReactionGameProps {
  socket: any;
  roomCode?: string;
  playerName: string;
}

type GameState = 'waiting' | 'ready' | 'set' | 'go' | 'result';

interface GameResult {
  winner: string;
  isFoul: boolean;
  responseTime?: number;
}

const ReactionGame = ({ socket, roomCode, playerName }: ReactionGameProps) => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [goTime, setGoTime] = useState<number | null>(null);
  const [clickTime, setClickTime] = useState<number | null>(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [currentRound, setCurrentRound] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [canClick, setCanClick] = useState(false);

  const startRound = useCallback(() => {
    setGameState('waiting');
    setGoTime(null);
    setClickTime(null);
    setCanClick(false);
    setCountdown(3);
    
    // Start countdown
    setTimeout(() => {
      setGameState('ready');
      setTimeout(() => {
        setGameState('set');
        setTimeout(() => {
          const randomDelay = Math.random() * 3000 + 2000; // 2-5 seconds
          setTimeout(() => {
            setGameState('go');
            setGoTime(Date.now());
            setCanClick(true);
          }, randomDelay);
        }, 1000);
      }, 1000);
    }, 1000);
  }, []);

  const handleClick = useCallback(() => {
    if (gameState === 'go' && canClick) {
      const clickTime = Date.now();
      setClickTime(clickTime);
      setCanClick(false);
      
      const responseTime = goTime ? clickTime - goTime : 0;
      const result: GameResult = {
        winner: playerName,
        isFoul: false,
        responseTime
      };
      
      setLastResult(result);
      setScores(prev => ({ ...prev, player1: prev.player1 + 1 }));
      setGameState('result');
      setShowResult(true);
      
    } else if (gameState !== 'go' && gameState !== 'waiting' && gameState !== 'result') {
      // Foul - clicked too early
      const result: GameResult = {
        winner: 'Opponent',
        isFoul: true
      };
      
      setLastResult(result);
      setScores(prev => ({ ...prev, player2: prev.player2 + 1 }));
      setGameState('result');
      setShowResult(true);
    }
  }, [gameState, canClick, goTime, playerName]);

  const nextRound = () => {
    setShowResult(false);
    if (currentRound < 3 && scores.player1 < 2 && scores.player2 < 2) {
      setCurrentRound(prev => prev + 1);
      setTimeout(startRound, 1000);
    }
  };

  useEffect(() => {
    startRound();
  }, [startRound]);

  const getStateDisplay = () => {
    switch (gameState) {
      case 'waiting':
        return { text: 'Get Ready...', color: 'text-blue-400', bg: 'from-blue-900 to-blue-800' };
      case 'ready':
        return { text: 'Ready...', color: 'text-yellow-400', bg: 'from-yellow-900 to-yellow-800' };
      case 'set':
        return { text: 'Set...', color: 'text-orange-400', bg: 'from-orange-900 to-orange-800' };
      case 'go':
        return { text: 'GO!', color: 'text-green-400', bg: 'from-green-900 to-green-800' };
      case 'result':
        return { text: 'Round Complete', color: 'text-purple-400', bg: 'from-purple-900 to-purple-800' };
      default:
        return { text: '', color: '', bg: '' };
    }
  };

  const stateDisplay = getStateDisplay();
  const isGameOver = scores.player1 === 2 || scores.player2 === 2;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${stateDisplay.bg} flex flex-col items-center justify-center p-4 transition-all duration-500`}>
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Score Display */}
      <Card className="w-full max-w-md mb-6 relative z-10 bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-white">
            <div className="text-center">
              <div className="text-sm opacity-75">You</div>
              <div className="text-2xl font-bold">{scores.player1}</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-75">Round {currentRound}/3</div>
              <Trophy className="w-6 h-6 mx-auto text-yellow-400" />
            </div>
            <div className="text-center">
              <div className="text-sm opacity-75">Opponent</div>
              <div className="text-2xl font-bold">{scores.player2}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Game Area */}
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <h2 className={`text-4xl font-bold ${stateDisplay.color} transition-all duration-300`}>
              {stateDisplay.text}
            </h2>
          </div>
          
          {gameState !== 'result' && (
            <Button
              onClick={handleClick}
              disabled={gameState === 'waiting'}
              className={`w-full h-32 text-2xl font-bold transition-all duration-200 ${
                gameState === 'go' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 animate-pulse scale-110' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
              } text-white border-0 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
            >
              {gameState === 'go' ? (
                <>
                  <Zap className="w-8 h-8 mr-3" />
                  CLICK!
                </>
              ) : (
                <>
                  <Clock className="w-8 h-8 mr-3" />
                  Wait...
                </>
              )}
            </Button>
          )}

          {gameState === 'result' && (
            <div className="space-y-4">
              <div className="text-white">
                {lastResult?.isFoul ? (
                  <div className="text-red-400">
                    <X className="w-12 h-12 mx-auto mb-2" />
                    <div className="text-xl font-bold">Too Early!</div>
                    <div className="text-sm opacity-75">Point to opponent</div>
                  </div>
                ) : (
                  <div className="text-green-400">
                    <Trophy className="w-12 h-12 mx-auto mb-2" />
                    <div className="text-xl font-bold">You Won!</div>
                    {lastResult?.responseTime && (
                      <div className="text-sm opacity-75">
                        {lastResult.responseTime}ms reaction time
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {!isGameOver && (
                <Button
                  onClick={nextRound}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-200 hover:scale-105"
                >
                  Next Round
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showResult && lastResult && (
        <ResultModal
          result={lastResult}
          scores={scores}
          currentRound={currentRound}
          isGameOver={isGameOver}
          onNextRound={nextRound}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
};

export default ReactionGame;
