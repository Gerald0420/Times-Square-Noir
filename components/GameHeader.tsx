
import React from 'react';

const GameHeader: React.FC = () => {
  return (
    <header className="w-full p-4 bg-black/40 text-center border-b-2 border-rose-800/50 shadow-lg">
      <h1 className="text-2xl md:text-3xl font-title text-rose-500 tracking-widest">
        Times Square Noir
      </h1>
      <p className="text-sm text-gray-400">An Interactive Fiction - NYC, 1986</p>
    </header>
  );
};

export default GameHeader;
