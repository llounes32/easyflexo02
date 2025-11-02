import React, { useState } from 'react';

const BoxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const MaximizeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
    </svg>
);

const CalculatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
    </svg>
  );


const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

interface LaizeResult {
    poses: number;
    laize: number;
    sideMargin: number;
}
interface LaizeCalculatorProps {
  onResultUpdate: (result: LaizeResult | null, labelLength: string) => void;
  onQuantityChange: (quantity: string) => void;
  desiredQuantity: string;
}


const LaizeCalculator: React.FC<LaizeCalculatorProps> = ({ onResultUpdate, onQuantityChange, desiredQuantity }) => {
  const [labelLength, setLabelLength] = useState<string>('');
  const [maxLaize, setMaxLaize] = useState<string>('330');
  const [result, setResult] = useState<LaizeResult | null>(null);
  const [error, setError] = useState<string>('');
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    setHasCalculated(true);
    const length = parseFloat(labelLength);
    const maxLaizeValue = parseFloat(maxLaize);

    if (isNaN(length) || length <= 0) {
      setError('Veuillez saisir une longueur d\'étiquette valide et positive.');
      setResult(null);
      onResultUpdate(null, labelLength);
      return;
    }
     if (isNaN(maxLaizeValue) || maxLaizeValue <= 0) {
      setError('Veuillez saisir une laize maximale valide et positive.');
      setResult(null);
      onResultUpdate(null, labelLength);
      return;
    }
    setError('');

    let bestResult: LaizeResult | null = null;
    const MIN_SIDE_MARGIN = 8;
    const MAX_SIDE_MARGIN = 15;
    const MIN_TOTAL_MARGIN = MIN_SIDE_MARGIN * 2;
    const GAP = 4;

    for (let poses = 1; poses < 100; poses++) { 
      const labelsWidth = length * poses;
      const gapsWidth = poses > 1 ? (poses - 1) * GAP : 0;
      const baseWidth = labelsWidth + gapsWidth;

      const minRequiredWidth = baseWidth + MIN_TOTAL_MARGIN;
      const roundedLaize = Math.ceil(minRequiredWidth / 10) * 10;

      if (roundedLaize > maxLaizeValue) {
        break; 
      }

      const totalMargin = roundedLaize - baseWidth;
      const sideMargin = totalMargin / 2;

      if (sideMargin >= MIN_SIDE_MARGIN && sideMargin <= MAX_SIDE_MARGIN) {
        bestResult = { poses, laize: roundedLaize, sideMargin };
      }
    }
    
    setResult(bestResult);
    onResultUpdate(bestResult, labelLength);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCalculate();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-800 mb-4">2. Calculateur de Laize Optimale</h3>
      <div className="space-y-4 flex-grow flex flex-col">
        <div>
          <label htmlFor="longueur-etiquette" className="block text-sm font-semibold text-slate-700 mb-2">
            Longueur Étiquette (F2) en mm :
          </label>
          <div className="relative">
             <BoxIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="number"
              id="longueur-etiquette"
              value={labelLength}
              onChange={(e) => setLabelLength(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: 100"
              step="0.1"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
            />
          </div>
        </div>
         <div>
          <label htmlFor="laize-maximale" className="block text-sm font-semibold text-slate-700 mb-2">
            Laize Maximale (mm) :
          </label>
          <div className="relative">
             <MaximizeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="number"
              id="laize-maximale"
              value={maxLaize}
              onChange={(e) => setMaxLaize(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: 330"
              step="1"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
            />
          </div>
        </div>
        
        <div>
            <label htmlFor="quantity-report" className="block text-sm font-semibold text-slate-700 mb-2">
                Quantité souhaitée (pour rapport) :
            </label>
            <div className="relative">
                <CalculatorIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="number"
                    id="quantity-report"
                    value={desiredQuantity}
                    onChange={(e) => onQuantityChange(e.target.value)}
                    placeholder="Ex: 10000"
                    step="1"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                />
            </div>
        </div>
        
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        
        <div className="flex-grow"></div>

        <button
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
        >
          <CheckIcon className="h-5 w-5"/>
          Calculer la Laize Optimale
        </button>

        <div className="mt-4 p-4 rounded-lg text-center transition-all duration-300">
            {hasCalculated && !error ? (
                result ? (
                    <div className="bg-slate-100 animate-fade-in-up">
                        <p className="text-sm font-semibold text-slate-700">Laize Optimale Recommandée :</p>
                        <p className="text-2xl font-bold text-indigo-600">{result.laize} mm</p>
                        <p className="text-sm text-slate-600">Pour <span className="font-bold">{result.poses}</span> étiquette(s) de front</p>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 animate-fade-in-up">
                        <p className="text-sm font-semibold text-amber-800 py-7">Aucune configuration trouvée.</p>
                    </div>
                )
            ) : null}
        </div>
         <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LaizeCalculator;
