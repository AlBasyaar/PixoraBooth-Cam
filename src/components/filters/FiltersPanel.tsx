import React from 'react';
import { Brush } from 'lucide-react';

interface FiltersPanelProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'none', name: 'Normal', description: 'No filter applied' },
    { id: 'grayscale', name: 'Grayscale', description: 'Black and white effect' },
    { id: 'sepia', name: 'Sepia', description: 'Vintage brown tone effect' },
    { id: 'invert', name: 'Invert', description: 'Inverted color effect' },
    { id: 'vintage', name: 'Vintage', description: 'Warm vintage photo look' },
  ];
  
  return (
    <div className="h-full bg-gray-800 p-6 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <Brush size={24} className="text-blue-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Photo Filters</h2>
        </div>
        
        <p className="text-gray-400 mb-6">
          Select a filter to apply to your photos in real-time
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filters.map(filter => (
            <FilterOption
              key={filter.id}
              id={filter.id}
              name={filter.name}
              description={filter.description}
              isSelected={currentFilter === filter.id}
              onSelect={() => onFilterChange(filter.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface FilterOptionProps {
  id: string;
  name: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

const FilterOption: React.FC<FilterOptionProps> = ({ 
  id, 
  name, 
  description, 
  isSelected, 
  onSelect 
}) => {
  return (
    <div 
      onClick={onSelect}
      className={`bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
        isSelected ? 'ring-2 ring-blue-500 scale-105' : ''
      }`}
    >
      <div className={`h-32 bg-gradient-to-br ${getFilterBackground(id)}`}>
        <div className={`h-full w-full flex items-center justify-center ${getFilterClass(id)}`}>
          <span className="text-xs font-medium bg-black/50 text-white px-2 py-1 rounded">
            {name}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-white">{name}</h3>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
};

const getFilterClass = (filterId: string): string => {
  switch (filterId) {
    case 'grayscale':
      return 'filter grayscale';
    case 'sepia':
      return 'filter sepia';
    case 'invert':
      return 'filter invert';
    case 'vintage':
      return 'filter brightness-110 contrast-105 saturate-90';
    default:
      return '';
  }
};

const getFilterBackground = (filterId: string): string => {
  switch (filterId) {
    case 'none':
      return 'from-blue-500 to-purple-600';
    case 'grayscale':
      return 'from-gray-500 to-gray-800';
    case 'sepia':
      return 'from-amber-500 to-amber-800';
    case 'invert':
      return 'from-indigo-400 to-indigo-700';
    case 'vintage':
      return 'from-orange-400 to-red-700';
    default:
      return 'from-gray-700 to-gray-900';
  }
};

export default FiltersPanel;