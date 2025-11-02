import React, { useState, useMemo, useEffect } from 'react';
import type { CalculationResult, Cylinder } from './types';
import { CYLINDER_DATA, MACHINES } from './constants';
import InputSection from './components/InputSection';
import OptimalResult from './components/OptimalResult';
import ResultsTable from './components/ResultsTable';
import CylinderManager from './components/CylinderManager';
import LaizeCalculator from './components/LaizeCalculator';
import MachineFilter from './components/MachineFilter';
import ReportPanel from './components/ReportPanel';
import LinearMeterageCalculator from './components/LinearMeterageCalculator';
import './assets/print.css';

const logoUrl = '/logo.png';

export interface LaizeResult {
    poses: number;
    laize: number;
    sideMargin: number;
}

export interface ReportState {
  cylinderResult: CalculationResult | null;
  cylinderDetails: Cylinder | null;
  laizeResult: LaizeResult | null;
  meterageResult: number | null;
  inputs: {
    labelWidth: string;
    labelLength: string;
    machineFilter: string;
    desiredQuantity: string;
    studyName: string;
  };
}

const ListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);

const App: React.FC = () => {
    const [labelWidth, setLabelWidth] = useState<string>('');
    const [results, setResults] = useState<CalculationResult[]>([]);
    const [optimalCylinder, setOptimalCylinder] = useState<CalculationResult | null>(null);
    const [manuallySelectedCylinder, setManuallySelectedCylinder] = useState<CalculationResult | null>(null);
    const [error, setError] = useState<string>('');
    const [hasCalculated, setHasCalculated] = useState<boolean>(false);
    
    const [cylinders, setCylinders] = useState<Cylinder[]>(CYLINDER_DATA);
    const [isManagerVisible, setIsManagerVisible] = useState<boolean>(false);
    const [machineFilter, setMachineFilter] = useState<string>('all');
    
    const [report, setReport] = useState<ReportState>({
        cylinderResult: null,
        cylinderDetails: null,
        laizeResult: null,
        meterageResult: null,
        inputs: {
            labelWidth: '',
            labelLength: '',
            machineFilter: 'all',
            desiredQuantity: '',
            studyName: ''
        }
    });

    const activeCylinderForReport = manuallySelectedCylinder || optimalCylinder;

    const runCalculation = (currentLabelWidth: string, currentCylinders: Cylinder[]) => {
        const width = parseFloat(currentLabelWidth);
        if (isNaN(width) || width <= 0) return;

        let meilleurCylindreResult: CalculationResult | null = null;
        let meilleureChute = Infinity;
        
        const allResults = currentCylinders.map((cylindre) => {
            const dimA = cylindre.dim_mm_A;
            const effectiveWidth = width;
            const I = effectiveWidth > 0 ? Math.floor(dimA / effectiveWidth) : 0;
            const J = I * effectiveWidth;
            const totalWaste = dimA - J;
            const K = I > 0 ? totalWaste / I : 0; 

            const result: CalculationResult = { nom: cylindre.nom, dimA, etiquettes: I, largeurUtilisee: J, chute: K };
            
            if (K >= 3 && K <= 8 && K < meilleureChute) {
                meilleureChute = K;
                meilleurCylindreResult = result;
            }
            return result;
        });

        const getSortGroup = (chute: number): number => {
            if (chute >= 3 && chute <= 8) return 1; // Optimal (Green)
            if (chute >= 1.5 && chute < 3) return 2; // Acceptable (Yellow)
            if (chute > 20 || chute < 1.5) return 3; // Inefficient (Red)
            return 4; // Other (Grey)
        };

        const sortedResults = allResults.sort((a, b) => {
            const groupA = getSortGroup(a.chute);
            const groupB = getSortGroup(b.chute);
            if (groupA !== groupB) {
                return groupA - groupB;
            }
            return a.chute - b.chute;
        });

        setResults(sortedResults);
        setOptimalCylinder(meilleurCylindreResult);
        setManuallySelectedCylinder(null); 
        
        const optimalCylinderDetails = meilleurCylindreResult ? currentCylinders.find(c => c.nom === meilleurCylindreResult!.nom) : null;
        setReport(prev => ({
            ...prev,
            cylinderResult: meilleurCylindreResult,
            cylinderDetails: optimalCylinderDetails || null,
            meterageResult: null,
            inputs: { ...prev.inputs, labelWidth: currentLabelWidth, machineFilter: machineFilter, desiredQuantity: '' }
        }));
    };

    const handleCalculate = () => {
        setHasCalculated(true);
        const width = parseFloat(labelWidth);
        if (isNaN(width) || width <= 0) {
            setError("Veuillez saisir une largeur d'étiquette valide et positive.");
            setResults([]);
            setOptimalCylinder(null);
            setManuallySelectedCylinder(null);
            return;
        }
        setError('');
        const currentFilteredCylinders = machineFilter === 'all' 
            ? cylinders 
            : cylinders.filter(c => c.machines.includes(machineFilter));
        runCalculation(labelWidth, currentFilteredCylinders);
    };
    
    const handleSelectCylinder = (selectedResult: CalculationResult) => {
        setManuallySelectedCylinder(selectedResult);
        const selectedCylinderDetails = cylinders.find(c => c.nom === selectedResult.nom);

        setReport(prev => {
            const newReportState: ReportState = {
                ...prev,
                cylinderResult: selectedResult,
                cylinderDetails: selectedCylinderDetails || null,
                meterageResult: null,
            };

            const desiredQty = parseInt(prev.inputs.desiredQuantity, 10);
            const laizeRes = prev.laizeResult;

            if (!isNaN(desiredQty) && desiredQty > 0 && laizeRes && selectedCylinderDetails) {
                const totalPoses = selectedResult.etiquettes * laizeRes.poses;
                if (totalPoses > 0) {
                    const circumference = selectedCylinderDetails.dim_mm_A;
                    const numberOfTurns = desiredQty / totalPoses;
                    const meterageInMm = numberOfTurns * circumference;
                    const meterageInM = meterageInMm / 1000;
                    newReportState.meterageResult = meterageInM;
                }
            }
            
            return newReportState;
        });
    };

    const handleLaizeUpdate = (laizeResult: LaizeResult | null, labelLength: string) => {
        setReport(prev => {
            const newReportState: ReportState = {
                ...prev,
                laizeResult: laizeResult,
                meterageResult: null,
                inputs: { ...prev.inputs, labelLength: labelLength }
            };

            const desiredQty = parseInt(prev.inputs.desiredQuantity, 10);
            const cylinderRes = prev.cylinderResult;
            const cylinderDetails = prev.cylinderDetails;
            
            if (!isNaN(desiredQty) && desiredQty > 0 && laizeResult && cylinderRes && cylinderDetails) {
                const totalPoses = cylinderRes.etiquettes * laizeResult.poses;
                if (totalPoses > 0) {
                    const circumference = cylinderDetails.dim_mm_A;
                    const numberOfTurns = desiredQty / totalPoses;
                    const meterageInMm = numberOfTurns * circumference;
                    const meterageInM = meterageInMm / 1000;
                    newReportState.meterageResult = meterageInM;
                }
            }
            
            return newReportState;
        });
    };
    
    const handleQuantityChange = (quantity: string) => {
        setReport(prev => {
            const newReportState: ReportState = {
                ...prev,
                meterageResult: null,
                inputs: { ...prev.inputs, desiredQuantity: quantity }
            };
            
            const desiredQty = parseInt(quantity, 10);
            const laizeRes = prev.laizeResult;
            const cylinderRes = prev.cylinderResult;
            const cylinderDetails = prev.cylinderDetails;

            if (!isNaN(desiredQty) && desiredQty > 0 && laizeRes && cylinderRes && cylinderDetails) {
                const totalPoses = cylinderRes.etiquettes * laizeRes.poses;
                if (totalPoses > 0) {
                    const circumference = cylinderDetails.dim_mm_A;
                    const numberOfTurns = desiredQty / totalPoses;
                    const meterageInMm = numberOfTurns * circumference;
                    const meterageInM = meterageInMm / 1000;
                    newReportState.meterageResult = meterageInM;
                }
            }

            return newReportState;
        });
    };
    
    const handleStudyNameChange = (name: string) => {
        setReport(prev => ({
            ...prev,
            inputs: { ...prev.inputs, studyName: name }
        }));
    };

    const handleSaveCylinder = (cylinderData: Cylinder, originalName?: string): boolean => {
        const nameExists = cylinders.some(c => c.nom.toLowerCase() === cylinderData.nom.toLowerCase());
        const isNewCylinder = !originalName;
        const nameHasChanged = originalName && originalName.toLowerCase() !== cylinderData.nom.toLowerCase();

        if ((isNewCylinder || nameHasChanged) && nameExists) {
            alert("Erreur : Un cylindre avec ce nom existe déjà. Veuillez choisir un nom unique.");
            return false;
        }

        let updatedCylinders;
        if (originalName) {
            updatedCylinders = cylinders.map(c => c.nom === originalName ? cylinderData : c);
        } else {
            updatedCylinders = [...cylinders, cylinderData].sort((a, b) => a.dim_mm_A - b.dim_mm_A);
        }
        setCylinders(updatedCylinders);

        if (hasCalculated) {
            const currentFilteredCylinders = machineFilter === 'all' 
                ? updatedCylinders 
                : updatedCylinders.filter(c => c.machines.includes(machineFilter));
            runCalculation(labelWidth, currentFilteredCylinders);
        }
        return true;
    };
    
    const handleDeleteCylinder = (cylinderName: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cylindre "${cylinderName}" ?`)) {
            const updatedCylinders = cylinders.filter(c => c.nom !== cylinderName);
            setCylinders(updatedCylinders);
            if (hasCalculated) {
                 const currentFilteredCylinders = machineFilter === 'all' 
                    ? updatedCylinders 
                    : updatedCylinders.filter(c => c.machines.includes(machineFilter));
                 runCalculation(labelWidth, currentFilteredCylinders);
            }
        }
    };
    
    const handleFilterChange = (machine: string) => {
        setMachineFilter(machine);
        setReport(prev => ({ ...prev, inputs: {...prev.inputs, machineFilter: machine }}));
        if(hasCalculated && labelWidth){
            const nextFilteredCylinders = machine === 'all'
                ? cylinders
                : cylinders.filter(c => c.machines.includes(machine));
            runCalculation(labelWidth, nextFilteredCylinders);
        }
    }

    return (
        <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <main className="max-w-screen-2xl mx-auto">
                <header className="text-center mb-10">
                    <img src={logoUrl} alt="Easy Emballage Logo" className="w-48 h-auto mx-auto mb-4"/>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight dark:text-white">
                        Easy Emballage
                    </h1>
                    <p className="text-lg text-slate-600 mt-1 dark:text-slate-400">
                        Optimiseur de Production
                    </p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* --- Main Content --- */}
                    <div className="lg:col-span-8 xl:col-span-8">
                        <div className="space-y-6">
                             <div className="bg-white p-6 rounded-2xl shadow-lg dark:bg-slate-800">
                                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Calculateurs</h2>
                                     <button
                                        onClick={() => setIsManagerVisible(true)}
                                        className="flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                                    >
                                        <ListIcon className="h-5 w-5" />
                                        Gérer les Cylindres
                                    </button>
                                 </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-lg h-full dark:bg-slate-800">
                                    <h3 className="text-xl font-bold text-slate-800 mb-4 dark:text-white">1. Optimiseur de Cylindre</h3>
                                    <MachineFilter 
                                        selectedMachine={machineFilter} 
                                        onSelectMachine={handleFilterChange}
                                    />
                                    <InputSection 
                                        labelWidth={labelWidth} 
                                        setLabelWidth={setLabelWidth} 
                                        onCalculate={handleCalculate}
                                        error={error}
                                    />
                                </div>
                                <LaizeCalculator 
                                    onResultUpdate={handleLaizeUpdate} 
                                    onQuantityChange={handleQuantityChange}
                                    desiredQuantity={report.inputs.desiredQuantity}
                                />
                                <LinearMeterageCalculator cylinders={cylinders} />
                            </div>
                            
                            <div>
                                <OptimalResult optimalCylinder={optimalCylinder} hasCalculated={hasCalculated} />
                                <ResultsTable 
                                    results={results} 
                                    recommendedCylinderName={optimalCylinder?.nom || null}
                                    selectedCylinderName={activeCylinderForReport?.nom || null}
                                    onSelectCylinder={handleSelectCylinder}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* --- Report Panel --- */}
                     <div className="lg:col-span-4 xl:col-span-4">
                        <ReportPanel 
                            report={report} 
                            onStudyNameChange={handleStudyNameChange}
                        />
                    </div>
                </div>
            </main>
            
            {isManagerVisible && (
                <CylinderManager 
                    cylinders={cylinders}
                    onClose={() => setIsManagerVisible(false)}
                    onSave={handleSaveCylinder}
                    onDelete={handleDeleteCylinder}
                />
            )}
        </div>
    );
};

export default App;
