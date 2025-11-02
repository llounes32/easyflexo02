import React from 'react';
import type { CalculationResult } from '../types';

interface ResultsTableProps {
  results: CalculationResult[];
  recommendedCylinderName: string | null;
  selectedCylinderName: string | null;
  onSelectCylinder: (result: CalculationResult) => void;
}

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const getRowClasses = (chute: number): string => {
    if (chute >= 3 && chute <= 8) {
        return 'border-l-4 border-teal-500'; // Optimal
    } else if (chute >= 1.5 && chute < 3) {
        return 'border-l-4 border-amber-500'; // Acceptable
    } else if (chute > 20 || chute < 1.5) {
        return 'border-l-4 border-red-500'; // Inefficient
    } else {
        return 'border-l-4 border-slate-300'; // Other
    }
};

const ColorKey: React.FC = () => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs text-slate-600 px-2 sm:px-0">
        <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-teal-500"></div>
            <span>Optimal (3-8mm)</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <span>Acceptable (1.5-3mm)</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span>Inefficace (&lt;1.5 ou &gt;20mm)</span>
        </div>
         <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-300"></div>
            <span>Autre</span>
        </div>
    </div>
);


const ResultsTable: React.FC<ResultsTableProps> = ({ results, recommendedCylinderName, selectedCylinderName, onSelectCylinder }) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Détail des Calculs</h2>
        <ColorKey />
        <div className="overflow-hidden rounded-xl shadow-lg bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-base text-left text-slate-700">
                    <thead className="text-sm text-slate-800 uppercase bg-slate-100 border-b-2 border-slate-200">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold">Cylindre (A)</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-center">Nbr. Étiquettes (I)</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-right">Largeur Utilisée (J)</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-right">Chute par Étiquette (K)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {results.map((res) => {
                            const isSelected = res.nom === selectedCylinderName;
                            const isRecommended = res.nom === recommendedCylinderName;
                            const borderClass = getRowClasses(res.chute);
                            return (
                                <tr 
                                    key={res.nom} 
                                    className={`transition-colors duration-200 cursor-pointer hover:bg-slate-100 ${isSelected ? 'bg-blue-50 ring-2 ring-blue-400 ring-inset' : ''}`}
                                    onClick={() => onSelectCylinder(res)}
                                >
                                    <td className={`px-6 py-4 whitespace-nowrap ${borderClass}`}>
                                        <div className="flex items-center gap-3">
                                            {isRecommended && (
                                                <span title="Cylindre Recommandé" className="text-amber-500">
                                                    <StarIcon fill="currentColor" />
                                                </span>
                                            )}
                                            <div>
                                                <div className="font-semibold text-slate-800">{res.nom}</div>
                                                <div className="text-sm text-slate-500">{res.dimA.toFixed(2)} mm</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium text-slate-800">{res.etiquettes}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">{res.largeurUtilisee.toFixed(3)} mm</td>
                                    <td className="px-6 py-4 text-right font-semibold text-slate-800">{res.chute.toFixed(3)} mm</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
             <p className="text-center text-sm text-slate-500 py-3 bg-slate-50">Cliquez sur une ligne pour la sélectionner comme cylindre final pour le rapport.</p>
        </div>
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

export default ResultsTable;