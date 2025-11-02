import React, { useState } from 'react';
import type { Cylinder } from '../types';
import AddCylinderForm from './AddCylinderForm';
import { MACHINES } from '../constants';

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

interface CylinderManagerProps {
    cylinders: Cylinder[];
    onClose: () => void;
    onSave: (cylinder: Cylinder, originalName?: string) => boolean;
    onDelete: (cylinderName: string) => void;
}

const CylinderManager: React.FC<CylinderManagerProps> = ({ cylinders, onClose, onSave, onDelete }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingCylinder, setEditingCylinder] = useState<Cylinder | null>(null);

    const handleStartEdit = (cylinder: Cylinder) => {
        setEditingCylinder(cylinder);
        setIsFormVisible(true);
    };

    const handleStartAdd = () => {
        setEditingCylinder(null);
        setIsFormVisible(true);
    };

    const sortedCylinders = [...cylinders].sort((a,b) => a.dim_mm_A - b.dim_mm_A);

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">Gestion des Cylindres</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl font-light">&times;</button>
                </header>
                <div className="flex-grow overflow-y-auto my-4 -mr-2 pr-2">
                    <ul className="space-y-3">
                        {sortedCylinders.map((cylinder) => (
                            <li key={cylinder.nom} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-800">{cylinder.nom}</p>
                                    <p className="text-sm text-slate-500">
                                        Dim: <span className="font-medium">{cylinder.dim_mm_A.toFixed(2)}mm</span> | Dents: <span className="font-medium">{cylinder.dents_B}</span> | Réf: <span className="font-medium">{cylinder.num_C}</span>
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {cylinder.machines.map(machineKey => (
                                             <span key={machineKey} className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                                                {MACHINES[machineKey as keyof typeof MACHINES] || machineKey}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4 ml-2">
                                    <button onClick={() => handleStartEdit(cylinder)} title="Modifier" className="p-2 text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => onDelete(cylinder.nom)} title="Supprimer" className="p-2 text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 rounded-full transition-colors">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <footer className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <p className="text-sm text-slate-600 font-medium">{cylinders.length} cylindre(s) au total.</p>
                    <button
                        onClick={handleStartAdd}
                        className="flex items-center gap-2 px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                    >
                        <PlusIcon/>
                        Ajouter un Cylindre
                    </button>
                </footer>
            </div>
            {isFormVisible && (
                <AddCylinderForm
                    onClose={() => setIsFormVisible(false)}
                    onSave={onSave}
                    initialData={editingCylinder}
                />
            )}
             <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: scale(0.95) translateY(20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
              .animate-fade-in-up {
                animation: fadeInUp 0.3s ease-out forwards;
              }
            `}</style>
        </div>
    );
};

export default CylinderManager;