import React, { useState } from 'react';
import type { Cylinder } from '../types';

const TapeMeasureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /><rect x="8" y="8" width="8" height="8" rx="2" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M2 12H1" /><path d="M5 12H4" /><path d="M22 12h-1" /><path d="M19 12h-1" />
    </svg>
);

const CalculatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
  </svg>
);

const RulerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L3 8.4a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0L15.3 9" /><path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" />
    </svg>
  );

const BoxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );

interface LinearMeterageCalculatorProps {
    cylinders: Cylinder[];
}

const LinearMeterageCalculator: React.FC<LinearMeterageCalculatorProps> = ({ cylinders }) => {
  const [desiredQuantity, setDesiredQuantity] = useState('');
  const [totalPosesPerTurn, setTotalPosesPerTurn] = useState('');
  const [cylinderCircumference, setCylinderCircumference] = useState('');
  const [meterageResult, setMeterageResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  
  const handleCalculate = () => {
    const desiredQty = parseInt(desiredQuantity, 10);
    const totalPoses = parseInt(totalPosesPerTurn, 10);
    const circumference = parseFloat(cylinderCircumference);

    const errors: string[] = [];
    if (isNaN(circumference) || circumference <= 0) {
        errors.push("Veuillez sélectionner un cylindre.");
    }
    if (isNaN(totalPoses) || totalPoses <= 0) {
        errors.push("Total d'étiquettes par tour invalide.");
    }
    if (isNaN(desiredQty) || desiredQty <= 0) {
        errors.push("Quantité souhaitée invalide.");
    }

    if (errors.length > 0) {
        setError(errors.join(' '));
        setMeterageResult(null);
        return;
    }
    
    setError('');
    
    const numberOfTurns = desiredQty / totalPoses;
    const meterageInMm = numberOfTurns * circumference;
    const meterageInM = meterageInMm / 1000;
    
    setMeterageResult(meterageInM);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCalculate();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-800 mb-4">3. Calculateur de Métrage</h3>
      <div className="space-y-4 flex-grow flex flex-col">
         <div>
          <label htmlFor="circumference-select" className="block text-sm font-semibold text-slate-700 mb-2">
              Développement du cylindre (mm) :
          </label>
            <div className="relative">
                <RulerIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <select
                    id="circumference-select"
                    value={cylinderCircumference}
                    onChange={(e) => setCylinderCircumference(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition appearance-none"
                >
                    <option value="">Sélectionnez un cylindre</option>
                    {cylinders.sort((a,b) => a.dim_mm_A - b.dim_mm_A).map((cyl) => (
                        <option key={cyl.nom} value={cyl.dim_mm_A}>
                            {cyl.nom} ({cyl.dim_mm_A.toFixed(2)} mm)
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
        <div>
          <label htmlFor="total-poses" className="block text-sm font-semibold text-slate-700 mb-2">
              Total étiquettes par tour :
          </label>
          <div className="relative">
              <BoxIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="number"
                id="total-poses"
                value={totalPosesPerTurn}
                onChange={(e) => setTotalPosesPerTurn(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: 36"
                step="1"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
              />
          </div>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-semibold text-slate-700 mb-2">
              Quantité d'étiquettes souhaitée :
          </label>
          <div className="relative">
              <CalculatorIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
              type="number"
              id="quantity"
              value={desiredQuantity}
              onChange={(e) => setDesiredQuantity(e.target.value)}
              onKeyDown={handleKeyDown}
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
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-105"
        >
            <TapeMeasureIcon className="h-5 w-5"/>
            Calculer le Métrage
        </button>

        <div className="mt-4 p-4 rounded-lg text-center transition-all duration-300 min-h-[96px]">
            {!error && meterageResult !== null ? (
                <div className="bg-slate-100 animate-fade-in-up p-4 rounded-lg">
                    <p className="text-sm font-semibold text-slate-700">Métrage Linéaire Requis :</p>
                    <p className="text-2xl font-bold text-teal-600">{meterageResult.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m</p>
                </div>
            ) : null}
        </div>
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
  );
};

export default LinearMeterageCalculator;