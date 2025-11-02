import React from 'react';

const RulerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L3 8.4a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0L15.3 9" /><path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" />
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);


interface InputSectionProps {
  labelWidth: string;
  setLabelWidth: (value: string) => void;
  onCalculate: () => void;
  error: string;
}

const InputSection: React.FC<InputSectionProps> = ({ labelWidth, setLabelWidth, onCalculate, error }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onCalculate();
    }
  };

  return (
    <div className="pt-2">
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 items-end">
        <div>
          <label htmlFor="largeur-etiquette" className="block text-sm font-semibold text-slate-700 mb-2">
            Largeur Étiquette (F1) en mm :
          </label>
           <div className="relative">
             <RulerIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="number"
              id="largeur-etiquette"
              value={labelWidth}
              onChange={(e) => setLabelWidth(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: 50.5"
              step="0.1"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
              aria-invalid={!!error}
              aria-describedby="width-error"
            />
          </div>
           {error && <p id="width-error" className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
        <button
          onClick={onCalculate}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
        >
          <CheckIcon className="h-5 w-5"/>
          Trouver le Cylindre Optimal
        </button>
      </div>
    </div>
  );
};

export default InputSection;