
import React from 'react';

interface ChoiceButtonsProps {
  choices: string[];
  onChoose: (choice: string) => void;
  disabled: boolean;
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ choices, onChoose, disabled }) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => onChoose(choice)}
          disabled={disabled}
          className="w-full p-3 bg-rose-800/80 text-white font-bold rounded-md border border-rose-500/50 hover:bg-rose-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 text-sm md:text-base"
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default ChoiceButtons;
