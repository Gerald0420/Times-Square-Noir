
import React from 'react';

interface SceneDisplayProps {
  imageUrl: string;
  description: string;
}

const SceneDisplay: React.FC<SceneDisplayProps> = ({ imageUrl, description }) => {
  return (
    <div className="flex-grow flex flex-col bg-black/30 rounded-lg border border-rose-500/30 overflow-hidden">
      <div className="w-full aspect-video bg-gray-800">
        {imageUrl ? (
            <img src={imageUrl} alt="Current scene" className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full flex items-center justify-center">
                <p>Loading image...</p>
            </div>
        )}
      </div>
      <div className="p-4 md:p-6 text-gray-300 overflow-y-auto">
        <p className="font-title text-lg leading-relaxed whitespace-pre-wrap">{description}</p>
      </div>
    </div>
  );
};

export default SceneDisplay;
