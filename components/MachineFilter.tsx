import React from 'react';
import { MACHINES } from '../constants';

interface MachineFilterProps {
  selectedMachine: string;
  onSelectMachine: (machineKey: string) => void;
}

const MachineFilter: React.FC<MachineFilterProps> = ({ selectedMachine, onSelectMachine }) => {
  const allMachines = { all: 'Toutes les Machines', ...MACHINES };

  return (
    <div className="mb-6 pb-6 border-b border-slate-200">
      <div className="flex flex-wrap gap-2">
        {Object.entries(allMachines).map(([key, name]) => {
          const isSelected = selectedMachine === key;
          return (
            <button
              key={key}
              onClick={() => onSelectMachine(key)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MachineFilter;