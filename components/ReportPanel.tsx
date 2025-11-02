import React from 'react';
import type { ReportState } from '../App';
import { logoDataUri } from '../assets/logo';
import { MACHINES } from '../constants';

const PrinterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
);


const ReportHeader: React.FC = () => (
    <div className="flex items-start justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
            <img src={logoDataUri} alt="Logo Easy Emballage" className="h-10 w-auto"/>
            <div>
                <h1 className="text-lg font-bold text-slate-800">Easy Emballage</h1>
                <p className="text-sm text-slate-500">Rapport d'Étude de Production</p>
            </div>
        </div>
        <p className="text-sm text-slate-500 text-right flex-shrink-0 ml-4">{new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p>
    </div>
);

interface ReportPanelProps {
    report: ReportState;
    onStudyNameChange: (name: string) => void;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ report, onStudyNameChange }) => {
    const { cylinderResult, cylinderDetails, laizeResult, meterageResult, inputs } = report;

    const machineName = MACHINES[inputs.machineFilter as keyof typeof MACHINES] || "Toutes les Machines";
    const hasData = cylinderResult || laizeResult;
    const totalPoses = cylinderResult && laizeResult ? cylinderResult.etiquettes * laizeResult.poses : null;

    return (
        <div className="sticky top-4 printable-area print:static">
            <div className="bg-white p-6 rounded-2xl shadow-lg h-full print:shadow-none">
                
                {!hasData ? (
                    <>
                       <h3 className="text-xl font-bold text-slate-800 mb-2 border-b-2 border-slate-200 pb-3">Rapport d'Étude</h3>
                       <div className="text-center py-12">
                            <p className="text-slate-500">Lancez un calcul pour voir le rapport de synthèse ici.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <ReportHeader />
                        <div className="space-y-5 mt-4 animate-fade-in">
                            
                             {/* --- Study Name Input --- */}
                            <div>
                                <label htmlFor="study-name" className="block text-sm font-semibold text-slate-700 mb-2">
                                  Nom de l'étude :
                                </label>
                                <input
                                  type="text"
                                  id="study-name"
                                  value={inputs.studyName}
                                  onChange={(e) => onStudyNameChange(e.target.value)}
                                  placeholder="Ex: Projet Client ABC"
                                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                                />
                            </div>

                             <hr className="border-slate-200"/>

                            {/* --- Section Inputs --- */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-3 text-base">Paramètres de l'Étude</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Largeur Étiquette :</span>
                                        <span className="font-semibold text-slate-800">{inputs.labelWidth ? `${inputs.labelWidth} mm` : '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Longueur Étiquette :</span>
                                        <span className="font-semibold text-slate-800">{inputs.labelLength ? `${inputs.labelLength} mm` : '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Machine :</span>
                                        <span className="font-semibold text-slate-800">{machineName}</span>
                                    </div>
                                    {inputs.desiredQuantity && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Quantité Cible :</span>
                                            <span className="font-semibold text-slate-800">{parseInt(inputs.desiredQuantity).toLocaleString('fr-FR')} étq.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-slate-200"/>

                            {/* --- Section Results --- */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-3 text-base">Résultats Optimaux</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="p-3 bg-slate-50 rounded-md">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Cylindre :</span>
                                            <span className="font-semibold text-blue-600 text-base">{cylinderDetails ? `${cylinderDetails.num_C} (${cylinderDetails.dim_mm_A.toFixed(2)} mm)` : '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-slate-500">Poses sur Cylindre :</span>
                                            <span className="font-semibold text-slate-800">{cylinderResult ? `${cylinderResult.etiquettes} poses` : '-'}</span>
                                        </div>
                                    </div>
                                <div className="p-3 bg-slate-50 rounded-md">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Laize :</span>
                                            <span className="font-semibold text-indigo-600 text-base">{laizeResult ? `${laizeResult.laize} mm` : '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-slate-500">Poses sur Laize :</span>
                                            <span className="font-semibold text-slate-800">{laizeResult ? `${laizeResult.poses} poses` : '-'}</span>
                                        </div>
                                        {laizeResult && (
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-slate-500">Réserve Côté :</span>
                                                <span className="font-semibold text-slate-800">{laizeResult.sideMargin.toFixed(2)} mm</span>
                                            </div>
                                        )}
                                    </div>
                                    {totalPoses !== null && (
                                        <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-md">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-semibold">Total / Tour :</span>
                                                <span className="font-extrabold text-blue-700 text-lg">{totalPoses} étq.</span>
                                            </div>
                                            <div className="text-right text-xs text-blue-600 font-medium">
                                                ({cylinderResult?.etiquettes || 0} × {laizeResult?.poses || 0})
                                            </div>
                                        </div>
                                    )}
                                    {meterageResult !== null && (
                                        <div className="p-3 bg-teal-50 border-l-4 border-teal-500 rounded-r-md">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-semibold">Métrage Linéaire :</span>
                                                <span className="font-extrabold text-teal-700 text-lg">{meterageResult.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} m</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <hr className="border-slate-200"/>

                            {/* --- Section Conclusion --- */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-2 text-base">Conclusion</h4>
                                <p className="text-sm text-slate-600 bg-slate-100 p-3 rounded-lg">
                                    La configuration recommandée est le cylindre <strong className="text-slate-800">{cylinderDetails?.num_C || 'N/A'}</strong> et une laize de <strong className="text-slate-800">{laizeResult?.laize || 'N/A'} mm</strong>.
                                    {totalPoses !== null && (
                                        <span className="block mt-1.5 font-semibold">
                                            Cela permet de produire <strong className="text-slate-800">{totalPoses} étiquettes</strong> par tour de cylindre.
                                        </span>
                                    )}
                                    {meterageResult !== null && inputs.desiredQuantity && (
                                        <span className="block mt-1.5 font-semibold">
                                            Pour produire <strong className="text-slate-800">{parseInt(inputs.desiredQuantity).toLocaleString('fr-FR')} étiquettes</strong>, il faudra <strong className="text-slate-800">{meterageResult.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} mètres</strong> de matière.
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </>
                )}
                {hasData && (
                    <div className="mt-6 pt-4 border-t border-slate-200 no-print">
                        <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all"
                        >
                            <PrinterIcon className="h-5 w-5"/>
                            Aperçu avant impression
                        </button>
                    </div>
                )}
                <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                `}</style>
            </div>
        </div>
    );
};

export default ReportPanel;