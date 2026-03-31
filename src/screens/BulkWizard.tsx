import { useState } from 'react';
import { ArrowRight, ArrowLeft, Percent, Edit3, CheckCircle2, Users, FileText, Settings, Download, Loader2 } from 'lucide-react';

interface BulkWizardProps {
  setCurrentView: (view: string) => void;
  selectedEmployees: any[];
}

export default function BulkWizard({ setCurrentView, selectedEmployees }: BulkWizardProps) {
  const [step, setStep] = useState(2); // Start at step 2 as requested
  const [ruleType, setRuleType] = useState<'flat' | 'manual' | null>(null);
  const [flatPercentage, setFlatPercentage] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [manualCTC, setManualCTC] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    selectedEmployees.forEach(emp => {
      initial[emp.id] = parseInt(emp.ctc.replace(/[^0-9]/g, ''));
    });
    return initial;
  });

  const steps = [
    { id: 1, name: 'Select Employees', icon: Users, status: 'complete' },
    { id: 2, name: 'Define Rules', icon: Settings, status: 'current' },
    { id: 3, name: 'Review & Generate', icon: FileText, status: 'upcoming' },
  ];

  const handleBatchGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      // Dynamically import jsPDF and autoTable
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const totalSteps = selectedEmployees.length;
      
      for (let i = 0; i < totalSteps; i++) {
        const emp = selectedEmployees[i];
        const doc = new jsPDF();
        
        // Add Company Logo Placeholder
        doc.setFillColor(28, 25, 23);
        doc.rect(95, 20, 20, 20, 'F');
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1);
        doc.rect(100, 25, 10, 10, 'S');

        // Add Header
        doc.setFont('times', 'bold');
        doc.setFontSize(24);
        doc.text('ANNEXURE A', 105, 55, { align: 'center' });
        
        doc.setFont('times', 'italic');
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text('Salary Structure & Compensation', 105, 65, { align: 'center' });

        // Add Employee Details
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        
        doc.text('NAME OF EMPLOYEE', 20, 85);
        doc.text('DESIGNATION', 110, 85);
        doc.text('EFFECTIVE DATE', 20, 100);
        doc.text('LOCATION', 110, 100);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(emp.name, 20, 90);
        doc.text(emp.role, 110, 90);
        doc.text('November 1, 2023', 20, 105);
        doc.text('San Francisco, CA', 110, 105);

        // Calculate new CTC based on rule
        let ctcValue = parseInt(emp.ctc.replace(/[^0-9]/g, ''));
        if (ruleType === 'flat') {
          ctcValue = ctcValue * (1 + (flatPercentage / 100));
        } else if (ruleType === 'manual') {
          ctcValue = manualCTC[emp.id] || ctcValue;
        }

        const basic = ctcValue * 0.4;
        const hra = ctcValue * 0.2;
        const special = ctcValue * 0.2;
        const bonus = ctcValue * 0.1;
        const pf = ctcValue * 0.05;
        const insurance = ctcValue * 0.05;

        const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
        };

        // Add Table
        autoTable(doc, {
          startY: 115,
          theme: 'grid',
          headStyles: { fillColor: [249, 250, 251], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [28, 25, 23] },
          bodyStyles: { lineColor: [28, 25, 23] },
          columnStyles: {
            0: { cellWidth: 120 },
            1: { cellWidth: 50, halign: 'right', font: 'courier' }
          },
          head: [['SALARY COMPONENT', 'ANNUAL AMOUNT (USD)']],
          body: [
            [{ content: 'A. FIXED COMPENSATION', colSpan: 2, styles: { fillColor: [243, 244, 246], fontStyle: 'bold' } }],
            ['Basic Salary', formatCurrency(basic)],
            ['House Rent Allowance (HRA)', formatCurrency(hra)],
            ['Special Allowance', formatCurrency(special)],
            [{ content: 'Total Fixed (A)', styles: { fontStyle: 'bold', halign: 'right' } }, { content: formatCurrency(basic + hra + special), styles: { fontStyle: 'bold' } }],
            
            [{ content: 'B. VARIABLE COMPENSATION', colSpan: 2, styles: { fillColor: [243, 244, 246], fontStyle: 'bold' } }],
            ['Target Performance Bonus', formatCurrency(bonus)],
            [{ content: 'Total Variable (B)', styles: { fontStyle: 'bold', halign: 'right' } }, { content: formatCurrency(bonus), styles: { fontStyle: 'bold' } }],
            
            [{ content: 'C. DEDUCTIONS & RETIRALS', colSpan: 2, styles: { fillColor: [243, 244, 246], fontStyle: 'bold' } }],
            ['Provident Fund (Employer Contribution)', formatCurrency(pf)],
            ['Health Insurance Premium', formatCurrency(insurance)],
            [{ content: 'Total Deductions (C)', styles: { fontStyle: 'bold', halign: 'right' } }, { content: formatCurrency(pf + insurance), styles: { fontStyle: 'bold' } }],
            
            [{ content: 'TOTAL COST TO COMPANY (A + B)', styles: { fillColor: [240, 253, 244], textColor: [4, 120, 87], fontStyle: 'bold', halign: 'right' } }, { content: formatCurrency(ctcValue), styles: { fillColor: [240, 253, 244], textColor: [4, 120, 87], fontStyle: 'bold' } }],
          ],
        });

        // Add Notes
        const finalY = (doc as any).lastAutoTable.finalY || 200;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Note:', 20, finalY + 15);
        doc.setFont('helvetica', 'normal');
        doc.text('1. All payments are subject to applicable statutory deductions and income tax.', 20, finalY + 22);
        doc.text('2. The Performance Bonus is indicative and payout depends on company and individual', 20, finalY + 29);
        doc.text('   performance as per the prevailing policy.', 20, finalY + 34);

        // Add Signatures
        doc.setDrawColor(28, 25, 23);
        doc.setLineDashPattern([1, 1], 0);
        
        // Employee Signature
        doc.line(20, finalY + 60, 80, finalY + 60);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Accepted By', 20, finalY + 67);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(emp.name, 20, finalY + 73);
        doc.text('Date: _______________', 20, finalY + 79);

        // HR Signature
        doc.line(130, finalY + 60, 190, finalY + 60);
        doc.setFont('times', 'italic');
        doc.setFontSize(16);
        doc.setTextColor(150, 150, 150);
        doc.text('S. Jenkins', 185, finalY + 57, { align: 'right' });
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text('Authorized Signatory', 190, finalY + 67, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Sarah Jenkins', 190, finalY + 73, { align: 'right' });

        doc.save(`Annexure_${emp.name.replace(/\s+/g, '_')}.pdf`);
        
        setProgress(((i + 1) / totalSteps) * 100);
        await new Promise(r => setTimeout(r, 300)); // Small delay for UI update
      }
    } catch (error) {
      console.error('Error in batch generation:', error);
    } finally {
      setIsGenerating(false);
      alert(`Successfully generated and downloaded PDF annexures for ${selectedEmployees.length} employees.`);
      setCurrentView('directory');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Bulk Annexure Generation</h1>
          <p className="text-muted mt-1">Configure compensation updates for {selectedEmployees.length} employees.</p>
        </div>
        <button 
          onClick={() => setCurrentView('directory')}
          className="text-muted hover:text-text text-sm font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isComplete = s.status === 'complete' || s.id < step;
            const isCurrent = s.id === step;
            
            return (
              <div key={s.id} className="flex flex-col items-center relative bg-background px-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isComplete ? 'bg-primary border-primary text-white' :
                  isCurrent ? 'bg-white border-primary text-primary' :
                  'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                  isComplete || isCurrent ? 'text-text' : 'text-gray-400'
                }`}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-surface rounded-ui shadow-ui p-8">
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-text mb-2">How would you like to update compensation?</h2>
            <p className="text-muted mb-8">Choose a rule to apply to the selected employees' current CTC.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Flat Percentage Card */}
              <div 
                onClick={() => setRuleType('flat')}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  ruleType === 'flat' 
                    ? 'border-primary bg-indigo-50/30 shadow-md' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                {ruleType === 'flat' && (
                  <div className="absolute top-4 right-4 text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  ruleType === 'flat' ? 'bg-primary text-white' : 'bg-indigo-100 text-primary'
                }`}>
                  <Percent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text mb-2">Flat Percentage Increase</h3>
                <p className="text-sm text-muted mb-6">Apply a standard percentage hike across all selected employees. Components will be scaled proportionally.</p>
                
                {ruleType === 'flat' && (
                  <div className="animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                    <label className="block text-sm font-semibold text-text mb-2">Increase Percentage</label>
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        value={flatPercentage}
                        onChange={(e) => setFlatPercentage(Number(e.target.value))}
                        className="w-24 px-3 py-2 bg-white border border-gray-300 rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                      />
                      <span className="ml-3 text-lg font-bold text-muted">%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Revision Card */}
              <div 
                onClick={() => setRuleType('manual')}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  ruleType === 'manual' 
                    ? 'border-primary bg-indigo-50/30 shadow-md' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                {ruleType === 'manual' && (
                  <div className="absolute top-4 right-4 text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  ruleType === 'manual' ? 'bg-primary text-white' : 'bg-indigo-100 text-primary'
                }`}>
                  <Edit3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text mb-2">Manual Revision</h3>
                <p className="text-sm text-muted">Review and adjust each employee's compensation individually in a spreadsheet-like view before generating.</p>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
              <button 
                onClick={() => setCurrentView('directory')}
                className="px-6 py-2.5 border border-gray-200 text-text rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={!ruleType}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Continue to Review <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            {ruleType === 'manual' ? (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-text mb-4">Manual Revision</h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Employee</th>
                        <th className="py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Current CTC</th>
                        <th className="py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">New CTC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedEmployees.map(emp => (
                        <tr key={emp.id} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-sm text-text">{emp.name}</p>
                            <p className="text-xs text-muted">{emp.role}</p>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted">{emp.ctc}</td>
                          <td className="py-3 px-4">
                            <div className="relative w-40">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
                              <input 
                                type="number" 
                                value={manualCTC[emp.id]}
                                onChange={(e) => setManualCTC({...manualCTC, [emp.id]: Number(e.target.value)})}
                                className="w-full pl-7 pr-3 py-1.5 bg-background border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center max-w-md mx-auto py-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-text mb-4">Ready to Generate</h2>
                <p className="text-muted mb-8">
                  You are about to generate {selectedEmployees.length} annexures using a {flatPercentage}% flat increase rule.
                </p>
              </div>
            )}
            <div className="flex space-x-4 justify-center">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-200 text-text rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleBatchGenerate}
                disabled={isGenerating}
                className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors flex items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating ({Math.round(progress)}%)
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" /> Generate PDFs
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
