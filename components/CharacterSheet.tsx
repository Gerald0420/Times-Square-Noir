
import React from 'react';

interface CharacterSheetProps {
  bio: string;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ bio }) => {
  return (
    <div>
      <h2 className="text-3xl font-title text-rose-400 border-b-2 border-rose-500/50 pb-2 mb-4">
        Character: Brock
      </h2>
      <div className="text-gray-300 space-y-4 font-light leading-relaxed whitespace-pre-wrap">
        {bio ? bio.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
        )) : <p>Loading bio...</p>}
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-title text-rose-400 border-b border-rose-500/30 pb-1 mb-2">
            Details
        </h3>
        <ul className="text-gray-400 space-y-1">
            <li><strong>Age:</strong> 26</li>
            <li><strong>Occupation:</strong> Waiter at Dino's Pizza-Pies</li>
            <li><strong>Residence:</strong> Studio Apt, Hell's Kitchen</li>
        </ul>
      </div>
    </div>
  );
};

export default CharacterSheet;
