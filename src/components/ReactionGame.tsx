
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Trophy, X, Clock, Star, Target } from 'lucide-react';
import ResultModal from './ResultModal';

interface ReactionGameProps {
  socket: any;
  roomCode?: string;
  player1Name: string;
  player2Name: string;
  onGameComplete: (winner: string, rounds: number, averageTime?: number) => void;
}

type GameState = 'waiting' | 'ready' | 'set' | 'go' | 'result';

interface GameResult {
  winner: string;
  isFoul: boolean;
  responseTime?: number;
  isPerfect?: boolean;
}

const ReactionGame = ({ socket, roomCode, player1Name, player2Name, onGameComplete }: ReactionGameProps) => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [goTime, setGoTime] = useState<number | null>(null);
  const [clickTime, setClickTime] = useState<number | null>(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [currentRound, setCurrentRound] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [canClick, setCanClick] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [perfectClicks, setPerfectClicks] = useState(0);
  const [combo, setCombo] = useState(0);

  const startRound = useCallback(() => {
    setGameState('waiting');
    setGoTime(null);
    setClickTime(null);
    setCanClick(false);
    setCountdown(3);
    
    // Enhanced countdown with effects
    setTimeout(() => {
      setGameState('ready');
      setTimeout(() => {
        setGameState('set');
        setTimeout(() => {
          const randomDelay = Math.random() * 4000 + 1500; // 1.5-5.5 seconds
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
      const isPerfect = responseTime < 200; // Under 200ms is perfect
      
      // Update reaction times array
      setReactionTimes(prev => [...prev, responseTime]);
      
      if (isPerfect) {
        setPerfectClicks(prev => prev + 1);
        setCombo(prev => prev + 1);
      } else {
        setCombo(0);
      }
      
      const result: GameResult = {
        winner: player1Name,
        isFoul: false,
        responseTime,
        isPerfect
      };
      
      setLastResult(result);
      setScores(prev => ({ ...prev, player1: prev.player1 + 1 }));
      setGameState('result');
      setShowResult(true);
      
    } else if (gameState !== 'go' && gameState !== 'waiting' && gameState !== 'result') {
      // Foul - clicked too early
      setCombo(0);
      const result: GameResult = {
        winner: player2Name,
        isFoul: true
      };
      
      setLastResult(result);
      setScores(prev => ({ ...prev, player2: prev.player2 + 1 }));
      setGameState('result');
      setShowResult(true);
    }
  }, [gameState, canClick, goTime, player1Name, player2Name]);

  const nextRound = () => {
    setShowResult(false);
    if (currentRound < 3 && scores.player1 < 2 && scores.player2 < 2) {
      setCurrentRound(prev => prev + 1);
      setTimeout(startRound, 1000);
    } else {
      // Game complete
      const winner = scores.player1 > scores.player2 ? player1Name : player2Name;
      const averageTime = reactionTimes.length > 0 
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : undefined;
      onGameComplete(winner, currentRound, averageTime);
    }
  };

  useEffect(() => {
    startRound();
  }, [startRound]);

  const getStateDisplay = () => {
    switch (gameState) {
      case 'waiting':
        return { 
          text: 'Get Ready...', 
          color: 'text-blue-400', 
          bg: 'from-blue-900 to-blue-800',
          effect: ''
        };
      case 'ready':
        return { 
          text: 'Ready...', 
          color: 'text-yellow-400', 
          bg: 'from-yellow-900 to-yellow-800',
          effect: 'animate-pulse'
        };
      case 'set':
        return { 
          text: 'Set...', 
          color: 'text-orange-400', 
          bg: 'from-orange-900 to-orange-800',
          effect: 'animate-bounce'
        };
      case 'go':
        return { 
          text: 'GO!', 
          color: 'text-green-400', 
          bg: 'from-green-900 to-green-800',
          effect: 'animate-pulse'
        };
      case 'result':
        return { 
          text: 'Round Complete', 
          color: 'text-purple-400', 
          bg: 'from-purple-900 to-purple-800',
          effect: ''
        };
      default:
        return { text: '', color: '', bg: '', effect: '' };
    }
  };

  const stateDisplay = getStateDisplay();
  const isGameOver = scores.player1 === 2 || scores.player2 === 2;
  const bestTime = reactionTimes.length > 0 ? Math.min(...reactionTimes) : null;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${stateDisplay.bg} flex flex-col items-center justify-center p-4 transition-all duration-500`}>
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Enhanced Score Display */}
      <Card className="w-full max-w-md mb-6 relative z-10 bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-white mb-3">
            <div className="text-center">
              <div className="text-sm opacity-75">{player1Name}</div>
              <div className="text-2xl font-bold">{scores.player1}</div>
              {combo > 1 && (
                <div className="text-xs text-yellow-400 animate-pulse">
                  {combo}x Combo!
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm opacity-75">Round {currentRound}/3</div>
              <Trophy className="w-6 h-6 mx-auto text-yellow-400" />
              {perfectClicks > 0 && (
                <div className="text-xs text-green-400 flex items-center justify-center">
                  <Star className="w-3 h-3 mr-1" />
                  {perfectClicks}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm opacity-75">{player2Name}</div>
              <div className="text-2xl font-bold">{scores.player2}</div>
            </div>
          </div>
          
          {bestTime && (
            <div className="text-center text-white/75 text-xs">
              Best: {bestTime}ms
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Game Area */}
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <h2 className={`text-4xl font-bold ${stateDisplay.color} ${stateDisplay.effect} transition-all duration-300`}>
              {stateDisplay.text}
            </h2>
          </div>
          
          {gameState !== 'result' && (
            <Button
              onClick={handleClick}
              disabled={gameState === 'waiting'}
              className={`w-full h-32 text-2xl font-bold transition-all duration-200 ${
                gameState === 'go' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 animate-pulse scale-110 shadow-2xl shadow-green-500/50' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
              } text-white border-0 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
            >
              {gameState === 'go' ? (
                <>
                  <Target className="w-8 h-8 mr-3 animate-spin" />
                  CLICK NOW!
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
                    <X className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                    <div className="text-xl font-bold">Too Early!</div>
                    <div className="text-sm opacity-75">Point to {player2Name}</div>
                  </div>
                ) : (
                  <div className="text-green-400">
                    <div className="flex justify-center mb-2">
                      {lastResult?.isPerfect ? (
                        <Star className="w-12 h-12 animate-spin text-yellow-400" />
                      ) : (
                        <Trophy className="w-12 h-12 animate-bounce" />
                      )}
                    </div>
                    <div className="text-xl font-bold">
                      {lastResult?.isPerfect ? 'PERFECT!' : 'You Won!'}
                    </div>
                    {lastResult?.responseTime && (
                      <div className="text-sm opacity-75">
                        {lastResult.responseTime}ms reaction time
                        {lastResult.isPerfect && (
                          <div className="text-yellow-400 text-xs">Lightning fast!</div>
                        )}
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
          player1Name={player1Name}
          player2Name={player2Name}
          onNextRound={nextRound}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
};

export default ReactionGame;
