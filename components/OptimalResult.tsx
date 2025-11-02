import React from 'react';
import type { CalculationResult } from '../types';

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

interface OptimalResultProps {
  optimalCylinder: CalculationResult | null;
  hasCalculated: boolean;
}

const OptimalResult: React.FC<OptimalResultProps> = ({ optimalCylinder, hasCalculated }) => {
  if (!hasCalculated) return null;

  const animationClass = 'animate-fade-in-up';

  return (
    <div className={`mt-8 ${animationClass}`}>
        {optimalCylinder ? (
             <div className="bg-teal-50 border-2 border-teal-500 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-12 w-12 text-teal-500"/>
                </div>
                <div>
                     <h3 className="text-lg font-bold text-teal-900">Cylindre Optimal Recommandé</h3>
                    <p className="text-base text-teal-800 mt-1">
                        Utilisez le cylindre <span className="font-extrabold">{optimalCylinder.nom}</span> ({optimalCylinder.dimA.toFixed(2)} mm)
                        avec une chute (K) de <span className="font-extrabold">{optimalCylinder.chute.toFixed(3)} mm</span>.
                    </p>
                </div>
            </div>
        ) : (
            <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                    <AlertTriangleIcon className="h-12 w-12 text-amber-500"/>
                </div>
                <div>
                     <h3 className="text-lg font-bold text-amber-900">Aucun Cylindre Optimal Trouvé</h3>
                    <p className="text-base text-amber-800 mt-1">
                        Aucun cylindre ne correspond aux critères (chute entre 3 et 8mm). Veuillez vérifier le tableau ci-dessous.
                    </p>
                </div>
            </div>
        )}
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default OptimalResult;