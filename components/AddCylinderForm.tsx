import React, { useState, useEffect } from 'react';
import type { Cylinder } from '../types';
import { MACHINES } from '../constants';

interface AddCylinderFormProps {
  onClose: () => void;
  onSave: (cylinder: Cylinder, originalName?: string) => boolean;
  initialData: Cylinder | null;
}

const AddCylinderForm: React.FC<AddCylinderFormProps> = ({ onClose, onSave, initialData }) => {
  const isEditMode = !!initialData;

  const [nom, setNom] = useState('');
  const [dim_mm_A, setDimMm_A] = useState('');
  const [dents_B, setDents_B] = useState('');
  const [num_C, setNum_C] = useState('');
  const [selectedMachines, setSelectedMachines] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isEditMode && initialData) {
      setNom(initialData.nom);
      setDimMm_A(String(initialData.dim_mm_A));
      setDents_B(String(initialData.dents_B));
      setNum_C(initialData.num_C);
      const machineSelection = Object.keys(MACHINES).reduce((acc, key) => {
        acc[key] = initialData.machines.includes(key);
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedMachines(machineSelection);
    }
  }, [initialData, isEditMode]);

  const handleMachineChange = (machineKey: string) => {
    setSelectedMachines(prev => ({
      ...prev,
      [machineKey]: !prev[machineKey]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignedMachines = Object.keys(selectedMachines).filter(key => selectedMachines[key]);

    if (!nom || !dim_mm_A || !dents_B || !num_C) {
      setFormError('Tous les champs sont requis.');
      return;
    }
    if (assignedMachines.length === 0) {
        setFormError('Veuillez assigner le cylindre à au moins une machine.');
        return;
    }
    
    const dimA_num = parseFloat(dim_mm_A);
    const dentsB_num = parseInt(dents_B, 10);

    if (isNaN(dimA_num) || isNaN(dentsB_num) || dimA_num <= 0 || dentsB_num <= 0) {
      setFormError('Les dimensions et le nombre de dents doivent être des nombres positifs.');
      return;
    }

    setFormError('');

    const cylinderData: Cylinder = {
      nom,
      dim_mm_A: dimA_num,
      dents_B: dentsB_num,
      num_C,
      machines: assignedMachines,
    };
    
    const success = onSave(cylinderData, isEditMode ? initialData.nom : undefined);
    if (success) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {isEditMode ? 'Modifier le Cylindre' : 'Ajouter un Nouveau Cylindre'}
        </h2>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5">
            <div>
              <label htmlFor="nom" className="block text-sm font-semibold text-slate-700">Nom du Cylindre</label>
              <input type="text" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Cylindre 128 Dents (Z128)" required 
              disabled={isEditMode}
              className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 transition"/>
              {isEditMode && <p className="text-xs text-slate-500 mt-1">Le nom ne peut pas être modifié.</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label htmlFor="dim_mm_A" className="block text-sm font-semibold text-slate-700">Dimension (A) en mm</label>
                <input type="number" id="dim_mm_A" value={dim_mm_A} onChange={(e) => setDimMm_A(e.target.value)} placeholder="Ex: 406.40" required step="0.01" className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
              </div>
              
              <div>
                <label htmlFor="dents_B" className="block text-sm font-semibold text-slate-700">Nombre de Dents (B)</label>
                <input type="number" id="dents_B" value={dents_B} onChange={(e) => setDents_B(e.target.value)} placeholder="Ex: 128" required className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
              </div>
            </div>

             <div>
              <label htmlFor="num_C" className="block text-sm font-semibold text-slate-700">Numéro / Identifiant (C)</label>
              <input type="text" id="num_C" value={num_C} onChange={(e) => setNum_C(e.target.value)} placeholder="Ex: Z128" required className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
            </div>
            
             <div>
                <label className="block text-sm font-semibold text-slate-700">Assigner aux Machines</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                  {Object.entries(MACHINES).map(([key, name]) => (
                    <div key={key} className="flex items-center">
                      <input
                        id={`machine-${key}`}
                        name={`machine-${key}`}
                        type="checkbox"
                        checked={!!selectedMachines[key]}
                        onChange={() => handleMachineChange(key)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor={`machine-${key}`} className="ml-2 block text-sm text-slate-800 cursor-pointer">
                        {name}
                      </label>
                    </div>
                  ))}
                </div>
            </div>

          </div>

          {formError && <p className="text-red-600 text-sm mt-4 text-center font-medium">{formError}</p>}

          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-300 text-sm font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition">
              Annuler
            </button>
            <button type="submit" className="px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
              {isEditMode ? 'Enregistrer les Modifications' : 'Ajouter le Cylindre'}
            </button>
          </div>
        </form>
         <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AddCylinderForm;