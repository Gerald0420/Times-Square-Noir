import React, { useState, useCallback } from 'react';
import { GameState, GameStatus } from './types';
import { generateInitialScene, generateNextScene, generateImage } from './services/geminiService';
import SceneDisplay from './components/SceneDisplay';
import ChoiceButtons from './components/ChoiceButtons';
import CharacterSheet from './components/CharacterSheet';
import LoadingSpinner from './components/LoadingSpinner';
import GameHeader from './components/GameHeader';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.NotStarted,
    characterBio: '',
    sceneDescription: '',
    sceneImageUrl: '',
    choices: [],
    history: [],
    error: null,
  });

  const startGame = useCallback(async () => {
    setGameState(prev => ({ ...prev, status: GameStatus.Loading, error: null }));
    try {
      const initialScene = await generateInitialScene();
      
      const imagePrompt = `A gritty, dimly lit, small studio apartment in Hell's Kitchen, New York City, 1986. A single window shows a sliver of the grimy brick building opposite. A messy unmade bed, a small kitchenette with dirty dishes. The style should be like a frame from a 1980s crime thriller movie, photorealistic with film grain.`;
      const imageUrl = await generateImage(imagePrompt);
      
      setGameState({
        status: GameStatus.InProgress,
        characterBio: initialScene.characterBio,
        sceneDescription: initialScene.sceneDescription,
        sceneImageUrl: imageUrl,
        choices: initialScene.choices,
        history: [initialScene.sceneDescription],
        error: null,
      });
    } catch (error) {
      console.error("Failed to start game:", error);
      setGameState(prev => ({ ...prev, status: GameStatus.Error, error: 'Failed to start the adventure. The city is unforgiving. Please try again.' }));
    }
  }, []);

  const handleChoice = useCallback(async (choice: string) => {
    setGameState(prev => ({ ...prev, status: GameStatus.Loading, error: null }));
    
    const context = [...gameState.history].slice(-3).join('\n---\n');

    try {
      const nextScene = await generateNextScene(context, choice);
      
      const imagePrompt = `${nextScene.sceneDescription} Style: like a frame from a 1980s crime thriller movie, photorealistic with film grain, gritty, noir.`;
      const imageUrl = await generateImage(imagePrompt);

      setGameState(prev => ({
        ...prev,
        status: GameStatus.InProgress,
        sceneDescription: nextScene.sceneDescription,
        sceneImageUrl: imageUrl,
        choices: nextScene.choices,
        history: [...prev.history, nextScene.sceneDescription],
      }));

    } catch (error) {
      console.error("Failed to advance story:", error);
      setGameState(prev => ({ 
          ...prev, 
          status: GameStatus.Error, 
          error: 'The narrative faltered. Some stories are not meant to be told. Try again.',
          choices: prev.choices.length > 0 ? prev.choices : ['Try again from previous step']
      }));
    }
  }, [gameState.history]);
  
  const renderContent = () => {
    const isLoading = gameState.status === GameStatus.Loading;

    switch (gameState.status) {
      case GameStatus.Loading:
      case GameStatus.InProgress:
        // Initial loading state before character bio is available
        if (isLoading && !gameState.characterBio) {
          return (
            <div className="flex flex-col items-center justify-center h-full">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-rose-300 font-title animate-pulse">The city is thinking...</p>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8 h-full">
            <div className="lg:col-span-1 h-full overflow-y-auto bg-black/30 p-4 rounded-lg border border-rose-500/30">
              <CharacterSheet bio={gameState.characterBio} />
            </div>
            <div className="lg:col-span-2 flex flex-col h-full">
              <div className="flex-grow relative">
                <SceneDisplay
                  imageUrl={gameState.sceneImageUrl}
                  description={gameState.sceneDescription}
                />
                {isLoading && (
                   <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                       <LoadingSpinner />
                       <p className="mt-4 text-lg text-rose-300 font-title animate-pulse">The city is thinking...</p>
                   </div>
                )}
              </div>
              <ChoiceButtons
                choices={gameState.choices}
                onChoose={handleChoice}
                disabled={isLoading}
              />
            </div>
          </div>
        );

      case GameStatus.Error:
          return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <h2 className="text-2xl text-red-500 font-title">An Error Occurred</h2>
              <p className="mt-4 text-gray-300">{gameState.error}</p>
              <button
                onClick={gameState.history.length > 0 ? () => setGameState(prev => ({...prev, status: GameStatus.InProgress})) : startGame}
                className="mt-6 px-6 py-2 bg-rose-700 text-white font-bold rounded-lg hover:bg-rose-600 transition-colors duration-300"
              >
                {gameState.history.length > 0 ? "Return to Game" : "Try Again"}
              </button>
            </div>
          );
          
      case GameStatus.NotStarted:
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center h-full p-8 bg-black/50 rounded-lg">
            <h1 className="text-5xl md:text-7xl font-title text-rose-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">TIMES SQUARE NOIR</h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-300">
              The year is 1986. You are Brock, fresh off the bus from upstate, trying to make it in a New York City that chews up dreamers and spits them out. This is your story.
            </p>
            <button
              onClick={startGame}
              className="mt-8 px-8 py-3 bg-rose-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-rose-500 transition-all duration-300 transform hover:scale-105"
            >
              Enter the Grind
            </button>
          </div>
        );
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen bg-cover bg-center" style={{backgroundImage: `url(https://picsum.photos/seed/nyc1986/1920/1080)`}}>
        <div className="bg-black/70 backdrop-blur-sm min-h-screen flex flex-col">
            <GameHeader />
            <div className="flex-grow container mx-auto">
                {renderContent()}
            </div>
        </div>
    </main>
  );
};

export default App;
