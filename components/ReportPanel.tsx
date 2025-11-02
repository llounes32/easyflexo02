import React from 'react';
import type { ReportState } from '../App';
import { MACHINES } from '../constants';

const logoUrl = '/logo.png';

const PrinterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
);

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const FileTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);


const ReportHeader: React.FC<{ studyName: string }> = ({ studyName }) => (
    <div className="report-header flex items-start justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
            <img src={logoUrl} alt="Logo Easy Emballage" className="h-12 w-auto"/>
            <div>
                <h1 className="text-xl font-bold text-slate-800">Rapport d'Étude de Production</h1>
                <p className="text-sm text-slate-600 font-medium">{studyName || "Nouvelle Étude"}</p>
            </div>
        </div>
        <p className="text-sm text-slate-500 text-right flex-shrink-0 ml-4">{new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</p>
    </div>
);

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-4">
        {icon}
        <h4 className="font-bold text-slate-700 text-lg">{title}</h4>
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
        <div className="sticky top-4 print:static">
            <div className="bg-white p-6 rounded-2xl shadow-lg h-full print:shadow-none print:p-0">
                
                {!hasData ? (
                    <>
                       <div className="flex items-center gap-3 text-xl font-bold text-slate-800 mb-2 border-b-2 border-slate-200 pb-3">
                           <FileTextIcon className="h-6 w-6 text-slate-500"/>
                           <span>Rapport d'Étude</span>
                        </div>
                       <div className="text-center py-12">
                            <p className="text-slate-500">Lancez un calcul pour voir le rapport de synthèse ici.</p>
                        </div>
                    </>
                ) : (
                    <div className="printable-area">
                        <ReportHeader studyName={inputs.studyName} />
                        <div className="space-y-6 mt-5 animate-fade-in">
                            
                             {/* --- Study Name Input --- */}
                            <div className="no-print">
                                <label htmlFor="study-name" className="block text-sm font-semibold text-slate-700 mb-2">
                                  Nom de l'étude
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

                            <hr className="border-slate-200 no-print"/>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* --- Section Inputs --- */}
                                <div className="break-inside-avoid">
                                    <SectionHeader icon={<SettingsIcon className="h-6 w-6 text-slate-500"/>} title="Paramètres" />
                                    <div className="space-y-2 text-sm pl-9">
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

                                {/* --- Section Results --- */}
                                <div className="break-inside-avoid">
                                    <SectionHeader icon={<CheckCircleIcon className="h-6 w-6 text-teal-600"/>} title="Résultats" />
                                    <div className="space-y-3 text-sm pl-9">
                                        <div className="p-3 bg-slate-50 rounded-md">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Cylindre :</span>
                                                <span className="font-semibold text-blue-600 text-base">{cylinderDetails ? `${cylinderDetails.num_C} (${cylinderDetails.dim_mm_A.toFixed(2)} mm)` : '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-slate-500">Poses / Cylindre :</span>
                                                <span className="font-semibold text-slate-800">{cylinderResult ? `${cylinderResult.etiquettes} poses` : '-'}</span>
                                            </div>
                                        </div>
                                    <div className="p-3 bg-slate-50 rounded-md">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Laize :</span>
                                                <span className="font-semibold text-indigo-600 text-base">{laizeResult ? `${laizeResult.laize} mm` : '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-slate-500">Poses / Laize :</span>
                                                <span className="font-semibold text-slate-800">{laizeResult ? `${laizeResult.poses} poses` : '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-slate-200"/>

                            {/* --- Totals & Meterage --- */}
                             <div className="space-y-3">
                                {totalPoses !== null && (
                                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-md">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 font-semibold">Total par Tour de Cylindre :</span>
                                            <span className="font-extrabold text-blue-700 text-xl">{totalPoses} étiquettes</span>
                                        </div>
                                        <div className="text-right text-xs text-blue-600 font-medium">
                                            ({cylinderResult?.etiquettes || 0} poses cylindre × {laizeResult?.poses || 0} poses laize)
                                        </div>
                                    </div>
                                )}
                                {meterageResult !== null && (
                                    <div className="p-3 bg-teal-50 border-l-4 border-teal-500 rounded-r-md">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 font-semibold">Métrage Linéaire Requis :</span>
                                            <span className="font-extrabold text-teal-700 text-xl">{meterageResult.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} m</span>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* --- Section Conclusion --- */}
                            <div className="break-inside-avoid">
                                <SectionHeader icon={<FileTextIcon className="h-6 w-6 text-slate-500"/>} title="Conclusion" />
                                <p className="text-sm text-slate-600 bg-slate-100 p-4 rounded-lg pl-12">
                                    La configuration recommandée est le cylindre <strong className="text-slate-800">{cylinderDetails?.num_C || 'N/A'}</strong> et une laize de <strong className="text-slate-800">{laizeResult?.laize || 'N/A'} mm</strong>.
                                    {totalPoses !== null && (
                                        <span className="block mt-2 font-semibold">
                                            Cela permet de produire <strong className="text-slate-800">{totalPoses} étiquettes</strong> par tour de cylindre.
                                        </span>
                                    )}
                                    {meterageResult !== null && inputs.desiredQuantity && (
                                        <span className="block mt-2 font-semibold">
                                            Pour produire <strong className="text-slate-800">{parseInt(inputs.desiredQuantity).toLocaleString('fr-FR')} étiquettes</strong>, il faudra <strong className="text-slate-800">{meterageResult.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} mètres</strong> de matière.
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {hasData && (
                    <div className="mt-6 pt-4 border-t border-slate-200 no-print">
                        <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all"
                        >
                            <PrinterIcon className="h-5 w-5"/>
                            Imprimer ou Exporter en PDF
                        </button>
                    </div>
                )}
                <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
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