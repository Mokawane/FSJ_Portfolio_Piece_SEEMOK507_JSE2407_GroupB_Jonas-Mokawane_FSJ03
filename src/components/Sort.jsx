'use client';

import { useState } from 'react';

const Sort = ({ onSortChange }) => {
  const [selectedSort, setSelectedSort] = useState('id');
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    {
      value: 'id',
      label: 'Sort',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
          <g>
            <path d="M228.267,56c-17.455-37.114-61.692-53.05-98.805-35.595C113.814,27.765,101.226,40.353,93.867,56H32c-17.673,0-32,14.327-32,32c0,17.673,14.327,32,32,32h61.76c17.455,37.114,61.692,53.05,98.805,35.595c15.647-7.359,28.235-19.948,35.595-35.595H480c17.673,0,32-14.327,32-32c0-17.673-14.327-32-32-32H228.267z" />
          </g>
        </svg>
      ),
    },
    {
      value: 'price-asc',
      label: 'Price: Low to High',
      icon: (
        <svg width="16" height="16" fill="currentColor">
          <path d="M8 12l-4-4h3V0h2v8h3l-4 4z" />
        </svg>
      ),
    },
    {
      value: 'price-desc',
      label: 'Price: High to Low',
      icon: (
        <svg width="16" height="16" fill="currentColor">
          <path d="M8 4l4 4H9v8H8V8H4l4-4z" />
        </svg>
      ),
    },
  ];

  const handleOptionClick = (option) => {
    setSelectedSort(option.value);
    onSortChange('sortBy', option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {options.find((option) => option.value === selectedSort).icon}
          <span className="ml-2">{options.find((option) => option.value === selectedSort).label}</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option.icon}
                <span className="ml-2">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sort;
