import { useState } from 'react';
import { ArrowRight, Calculator, Info, AlertCircle, Undo, Redo, MessageSquare, MessageSquarePlus, AlertTriangle } from 'lucide-react';

interface BuilderProps {
  setCurrentView: (view: string) => void;
  annexureData: any;
  setAnnexureData: (data: any) => void;
}

// HR Policy Constraints
const constraints: Record<string, { min: number; max: number; label: string }> = {
  basic: { min: 30000, max: 200000, label: 'Basic Salary' },
  hra: { min: 0, max: 100000, label: 'HRA' },
  special: { min: 0, max: 100000, label: 'Special Allowance' },
  lta: { min: 0, max: 20000, label: 'LTA' },
  bonus: { min: 0, max: 100000, label: 'Bonus' },
  retention: { min: 0, max: 50000, label: 'Retention' },
  pf: { min: 0, max: 20000, label: 'PF' },
  insurance: { min: 0, max: 10000, label: 'Insurance' }
};

export default function Builder({ setCurrentView, annexureData, setAnnexureData }: BuilderProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [past, setPast] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);
  const [activeNoteField, setActiveNoteField] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'undo' | 'redo' | null>(null);

  const saveHistory = () => {
    setPast([...past, annexureData]);
    setFuture([]);
  };

  const handleUndo = () => {
    if (past.length === 0) return;
    setConfirmAction('undo');
  };

  const executeUndo = () => {
    const previous = past[past.length - 1];
    setPast(past.slice(0, -1));
    setFuture([annexureData, ...future]);
    setAnnexureData(previous);
    setErrors({});
    setConfirmAction(null);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    setConfirmAction('redo');
  };

  const executeRedo = () => {
    const next = future[0];
    setFuture(future.slice(1));
    setPast([...past, annexureData]);
    setAnnexureData(next);
    setErrors({});
    setConfirmAction(null);
  };

  const handleEmployeeChange = (field: string, value: string) => {
    saveHistory();
    setAnnexureData({
      ...annexureData,
      employee: {
        ...annexureData.employee,
        [field]: value
      }
    });
  };

  const handleNoteChange = (field: string, value: string) => {
    saveHistory();
    setAnnexureData({
      ...annexureData,
      notes: {
        ...(annexureData.notes || {}),
        [field]: value
      }
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const handleInputChange = (category: string, field: string, value: string) => {
    // Strip non-numeric characters for parsing
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    
    saveHistory();

    // Validate against constraints
    const fieldConstraints = constraints[field];
    let errorMsg = '';
    if (fieldConstraints) {
      if (numValue < fieldConstraints.min) {
        errorMsg = `Value is below the minimum policy limit of ${formatCurrency(fieldConstraints.min)}. Adjust to comply with HR bands.`;
      } else if (numValue > fieldConstraints.max) {
        errorMsg = `Value exceeds the maximum policy limit of ${formatCurrency(fieldConstraints.max)}. Requires executive approval.`;
      }
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMsg
    }));

    setAnnexureData({
      ...annexureData,
      [category]: {
        ...annexureData[category],
        [field]: numValue
      }
    });
  };

  const calculateTotal = (category: string) => {
    return Object.values(annexureData[category]).reduce((a: any, b: any) => a + b, 0) as number;
  };

  const fixedTotal = calculateTotal('fixed');
  const variableTotal = calculateTotal('variable');
  const deductionsTotal = calculateTotal('deductions');
  const grossTotal = fixedTotal + variableTotal;
  const netTotal = grossTotal - deductionsTotal;

  const hasErrors = Object.values(errors).some(err => err !== '');

  const renderInput = (category: string, field: { id: string; label: string }) => {
    const hasError = !!errors[field.id];
    const hasNote = !!annexureData.notes?.[field.id];
    const isNoteActive = activeNoteField === field.id;

    return (
      <div key={field.id} className="flex flex-col mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <label className="text-sm font-medium text-text mr-2">{field.label}</label>
            <div className="relative group flex items-center">
              <button 
                onClick={() => setActiveNoteField(isNoteActive ? null : field.id)}
                className={`p-1 rounded-md transition-colors ${hasNote ? 'text-primary bg-indigo-50' : 'text-gray-400 hover:text-primary hover:bg-gray-50'}`}
              >
                {hasNote ? <MessageSquare className="w-3.5 h-3.5" /> : <MessageSquarePlus className="w-3.5 h-3.5" />}
              </button>
              {hasNote && !isNoteActive && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <p className="font-semibold mb-1 text-gray-300">Internal Note:</p>
                  <p className="line-clamp-3">{annexureData.notes[field.id]}</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          </div>
          <div className="relative w-48">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${hasError ? 'text-red-500' : 'text-muted'}`}>$</span>
            <input 
              type="text" 
              value={annexureData[category][field.id].toLocaleString()}
              onChange={(e) => handleInputChange(category, field.id, e.target.value)}
              className={`w-full pl-7 pr-3 py-2 bg-background border rounded-lg text-sm text-right focus:outline-none focus:ring-2 font-mono transition-colors ${
                hasError 
                  ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500 text-red-700 bg-red-50' 
                  : 'border-gray-200 focus:ring-primary/20 focus:border-primary/50'
              }`}
            />
          </div>
        </div>
        {hasError && (
          <div className="flex justify-end mt-1.5">
            <p className="text-xs text-red-600 flex items-start font-medium max-w-[280px] text-right">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5" />
              <span>{errors[field.id]}</span>
            </p>
          </div>
        )}
        {isNoteActive && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-1">
            <textarea 
              value={annexureData.notes?.[field.id] || ''}
              onChange={(e) => handleNoteChange(field.id, e.target.value)}
              placeholder={`Add internal notes for ${field.label}...`}
              className="w-full p-3 text-sm bg-amber-50/50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder:text-amber-700/40 text-amber-900 resize-none"
              rows={2}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex gap-8">
      {/* Left Panel: Form */}
      <div className="flex-1 flex flex-col bg-surface rounded-ui shadow-ui overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-text">Salary Components</h2>
            <p className="text-sm text-muted mt-1">Define the compensation structure for this annexure.</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleUndo} 
              disabled={past.length === 0}
              className="p-2 text-muted hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={future.length === 0}
              className="p-2 text-muted hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
              title="Redo"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Employee Details */}
          <section>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 flex items-center">
              Employee Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Employee Name</label>
                <input 
                  type="text" 
                  value={annexureData.employee.name}
                  onChange={(e) => handleEmployeeChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Designation</label>
                <input 
                  type="text" 
                  value={annexureData.employee.role}
                  onChange={(e) => handleEmployeeChange('role', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Fixed Components */}
          <section>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 flex items-center">
              Fixed Compensation
            </h3>
            <div className="space-y-1">
              {[
                { id: 'basic', label: 'Basic Salary' },
                { id: 'hra', label: 'House Rent Allowance (HRA)' },
                { id: 'special', label: 'Special Allowance' },
                { id: 'lta', label: 'Leave Travel Allowance' }
              ].map((field) => renderInput('fixed', field))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Variable Components */}
          <section>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 flex items-center">
              Variable Compensation
              <Info className="w-4 h-4 text-muted ml-2" />
            </h3>
            <div className="space-y-1">
              {[
                { id: 'bonus', label: 'Target Performance Bonus' },
                { id: 'retention', label: 'Retention Bonus' }
              ].map((field) => renderInput('variable', field))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Deductions */}
          <section>
            <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 flex items-center">
              Deductions
            </h3>
            <div className="space-y-1">
              {[
                { id: 'pf', label: 'Provident Fund (Employer)' },
                { id: 'insurance', label: 'Health Insurance Premium' }
              ].map((field) => renderInput('deductions', field))}
            </div>
          </section>
        </div>
      </div>

      {/* Right Panel: Live Summary */}
      <div className="w-96 flex flex-col bg-surface rounded-ui shadow-ui overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-text flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-primary" />
            Live Summary
          </h2>
        </div>
        
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Fixed Total</span>
              <span className="font-medium text-text font-mono">{formatCurrency(fixedTotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Variable Total</span>
              <span className="font-medium text-text font-mono">{formatCurrency(variableTotal)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-semibold text-text">Gross Annual</span>
              <span className="font-bold text-text font-mono">{formatCurrency(grossTotal)}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Total Deductions</span>
              <span className="font-medium text-red-600 font-mono">-{formatCurrency(deductionsTotal)}</span>
            </div>
          </div>

          {/* Pay Structure Distribution Bar */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3">Pay Structure</h3>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${grossTotal > 0 ? (fixedTotal / grossTotal) * 100 : 0}%` }}
                title={`Fixed: ${grossTotal > 0 ? Math.round((fixedTotal / grossTotal) * 100) : 0}%`}
              />
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${grossTotal > 0 ? (variableTotal / grossTotal) * 100 : 0}%` }}
                title={`Variable: ${grossTotal > 0 ? Math.round((variableTotal / grossTotal) * 100) : 0}%`}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-1.5" />
                <span>Fixed ({grossTotal > 0 ? Math.round((fixedTotal / grossTotal) * 100) : 0}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                <span>Variable ({grossTotal > 0 ? Math.round((variableTotal / grossTotal) * 100) : 0}%)</span>
              </div>
            </div>
          </div>

          {/* Market Insight Card */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mt-4">
            <div className="flex items-start">
              <div className="bg-white p-1.5 rounded-lg shadow-sm mr-3">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text mb-1">Market Insight</h4>
                <p className="text-xs text-muted leading-relaxed">
                  This compensation package is <strong className="text-emerald-700 font-semibold">12% above</strong> the market average for a <span className="font-medium text-text">{annexureData.employee.role || 'similar role'}</span> in this region.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-accent-light border-t border-emerald-100">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">Total CTC</p>
              <p className="text-xs text-emerald-700/70">Cost to Company (Annual)</p>
            </div>
            <div className="text-3xl font-bold text-accent font-mono tracking-tight">
              {formatCurrency(grossTotal)}
            </div>
          </div>
          
          <button 
            onClick={() => setCurrentView('preview')}
            disabled={hasErrors}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm ${
              hasErrors 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-accent hover:bg-emerald-800 text-white'
            }`}
          >
            {hasErrors ? 'Fix Errors to Continue' : 'Preview Document'}
            {!hasErrors && <ArrowRight className="w-5 h-5 ml-2" />}
          </button>
        </div>
      </div>

      {/* Undo/Redo Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-text mb-2">
              Confirm {confirmAction === 'undo' ? 'Undo' : 'Redo'}
            </h3>
            <p className="text-center text-muted mb-6">
              Are you sure you want to {confirmAction === 'undo' ? 'revert' : 'reapply'} your last change? This will update the salary components.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-text rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction === 'undo' ? executeUndo : executeRedo}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors"
              >
                Yes, {confirmAction === 'undo' ? 'Undo' : 'Redo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
