import { Download, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PreviewProps {
  setCurrentView: (view: string) => void;
  annexureData: any;
}

export default function Preview({ setCurrentView, annexureData }: PreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const fixedTotal = Object.values(annexureData.fixed).reduce((a: any, b: any) => a + b, 0) as number;
  const variableTotal = Object.values(annexureData.variable).reduce((a: any, b: any) => a + b, 0) as number;
  const deductionsTotal = Object.values(annexureData.deductions).reduce((a: any, b: any) => a + b, 0) as number;
  const grossTotal = fixedTotal + variableTotal;
  const netTotal = grossTotal - deductionsTotal;

  const handleDownload = () => {
    setIsDownloading(true);
    
    try {
      const doc = new jsPDF();
      
      // Add Company Logo Placeholder
      doc.setFillColor(28, 25, 23); // #1C1917
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
      doc.text(annexureData.employee.name, 20, 90);
      doc.text(annexureData.employee.role, 110, 90);
      doc.text('November 1, 2023', 20, 105);
      doc.text('San Francisco, CA', 110, 105);

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
          ['Basic Salary', formatCurrency(annexureData.fixed.basic)],
          ['House Rent Allowance (HRA)', formatCurrency(annexureData.fixed.hra)],
          ['Special Allowance', formatCurrency(annexureData.fixed.special)],
          ['Leave Travel Allowance', formatCurrency(annexureData.fixed.lta)],
          [{ content: 'Total Fixed (A)', styles: { fontStyle: 'bold', halign: 'right' } }, { content: formatCurrency(fixedTotal), styles: { fontStyle: 'bold' } }],
          
          [{ content: 'B. VARIABLE COMPENSATION', colSpan: 2, styles: { fillColor: [243, 244, 246], fontStyle: 'bold' } }],
          ['Target Performance Bonus', formatCurrency(annexureData.variable.bonus)],
          ['Retention Bonus', formatCurrency(annexureData.variable.retention)],
          [{ content: 'Total Variable (B)', styles: { fontStyle: 'bold', halign: 'right' } }, { content: formatCurrency(variableTotal), styles: { fontStyle: 'bold' } }],
          
          [{ content: 'C. DEDUCTIONS & RETIRALS', colSpan: 2, styles: { fillColor: [243, 244, 246], fontStyle: 'bold' } }],
          ['Provident Fund (Employer Contribution)', formatCurrency(annexureData.deductions.pf)],
          ['Health Insurance Premium', formatCurrency(annexureData.deductions.insurance)],
          [{ content: 'Total Deductions (C)', styles: { fontStyle: 'bold', halign: 'right' } }, { content: formatCurrency(deductionsTotal), styles: { fontStyle: 'bold' } }],
          
          [{ content: 'TOTAL COST TO COMPANY (A + B)', styles: { fillColor: [240, 253, 244], textColor: [4, 120, 87], fontStyle: 'bold', halign: 'right' } }, { content: formatCurrency(grossTotal), styles: { fillColor: [240, 253, 244], textColor: [4, 120, 87], fontStyle: 'bold' } }],
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
      doc.text('3. This annexure is strictly confidential and should not be discussed with anyone', 20, finalY + 41);
      doc.text('   other than the HR department.', 20, finalY + 46);

      // Add Signatures
      doc.setDrawColor(28, 25, 23);
      doc.setLineDashPattern([1, 1], 0);
      
      // Employee Signature
      doc.line(20, finalY + 80, 80, finalY + 80);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Accepted By', 20, finalY + 87);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(annexureData.employee.name, 20, finalY + 93);
      doc.text('Date: _______________', 20, finalY + 99);

      // HR Signature
      doc.line(130, finalY + 80, 190, finalY + 80);
      doc.setFont('times', 'italic');
      doc.setFontSize(16);
      doc.setTextColor(150, 150, 150);
      doc.text('S. Jenkins', 185, finalY + 77, { align: 'right' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('Authorized Signatory', 190, finalY + 87, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Sarah Jenkins', 190, finalY + 93, { align: 'right' });
      doc.text('Human Resources', 190, finalY + 99, { align: 'right' });

      // Save the PDF
      doc.save(`Annexure_${annexureData.employee.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApprove = () => {
    setIsApproved(true);
    setTimeout(() => setCurrentView('dashboard'), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/80 overflow-y-auto backdrop-blur-sm flex flex-col">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-10 bg-surface border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => setCurrentView('builder')}
            className="p-2 mr-4 text-muted hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-text">Preview Annexure</h2>
            <p className="text-xs text-muted">Review the formal document before issuing.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-text hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download PDF
          </button>
          <button 
            onClick={handleApprove}
            disabled={isApproved}
            className={`px-6 py-2 rounded-lg text-sm font-semibold text-white transition-colors flex items-center shadow-sm ${
              isApproved ? 'bg-emerald-600' : 'bg-primary hover:bg-primary-hover'
            }`}
          >
            {isApproved ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approved
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Approve & Issue
              </>
            )}
          </button>
        </div>
      </div>

      {/* A4 Document Container */}
      <div className="flex-1 py-12 flex justify-center">
        <div className="w-[800px] min-h-[1131px] bg-white shadow-doc relative p-16 font-sans text-[#1C1917]">
          
          {/* Document Header */}
          <div className="text-center mb-12 border-b-2 border-[#1C1917] pb-8 relative">
            <div className="absolute left-0 top-0 w-16 h-16 bg-[#1C1917] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white"></div>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-wide uppercase mb-2">Annexure A</h1>
            <h2 className="font-serif text-xl text-gray-600 italic">Salary Structure & Compensation</h2>
          </div>

          {/* Employee Info */}
          <div className="mb-10 grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
            <div>
              <span className="font-bold text-gray-500 uppercase tracking-wider text-xs block mb-1">Name of Employee</span>
              <span className="font-semibold text-base">{annexureData.employee.name}</span>
            </div>
            <div>
              <span className="font-bold text-gray-500 uppercase tracking-wider text-xs block mb-1">Designation</span>
              <span className="font-semibold text-base">{annexureData.employee.role}</span>
            </div>
            <div>
              <span className="font-bold text-gray-500 uppercase tracking-wider text-xs block mb-1">Effective Date</span>
              <span className="font-semibold text-base">November 1, 2023</span>
            </div>
            <div>
              <span className="font-bold text-gray-500 uppercase tracking-wider text-xs block mb-1">Location</span>
              <span className="font-semibold text-base">San Francisco, CA</span>
            </div>
          </div>

          {/* Salary Table */}
          <table className="w-full border-collapse border border-[#1C1917] mb-12">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-[#1C1917] py-3 px-4 text-left font-bold uppercase tracking-wider text-xs w-2/3">Salary Component</th>
                <th className="border border-[#1C1917] py-3 px-4 text-right font-bold uppercase tracking-wider text-xs w-1/3">Annual Amount (USD)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Fixed */}
              <tr>
                <td colSpan={2} className="border border-[#1C1917] py-2 px-4 bg-gray-100 font-bold text-xs uppercase tracking-wider">A. Fixed Compensation</td>
              </tr>
              <tr>
                <td className="border border-[#1C1917] py-3 px-4">Basic Salary</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(annexureData.fixed.basic)}</td>
              </tr>
              <tr>
                <td className="border border-[#1C1917] py-3 px-4">House Rent Allowance (HRA)</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(annexureData.fixed.hra)}</td>
              </tr>
              <tr>
                <td className="border border-[#1C1917] py-3 px-4">Special Allowance</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(annexureData.fixed.special)}</td>
              </tr>
              <tr>
                <td className="border border-[#1C1917] py-3 px-4">Leave Travel Allowance</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(annexureData.fixed.lta)}</td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="border border-[#1C1917] py-3 px-4 text-right">Total Fixed (A)</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(fixedTotal)}</td>
              </tr>

              {/* Variable */}
              <tr>
                <td colSpan={2} className="border border-[#1C1917] py-2 px-4 bg-gray-100 font-bold text-xs uppercase tracking-wider">B. Variable Compensation</td>
              </tr>
              <tr>
                <td className="border border-[#1C1917] py-3 px-4">Target Performance Bonus</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(annexureData.variable.bonus)}</td>
              </tr>
              <tr>
                <td className="border border-[#1C1917] py-3 px-4">Retention Bonus</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(annexureData.variable.retention)}</td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="border border-[#1C1917] py-3 px-4 text-right">Total Variable (B)</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(variableTotal)}</td>
              </tr>

              {/* Deductions */}
              <tr>
                <td colSpan={2} className="border border-[#1C1917] py-2 px-4 bg-gray-100 font-bold text-xs uppercase tracking-wider">C. Deductions & Retirals</td>
              </tr>
              <tr>
                <td className="border border-[#1C1917] py-3 px-4">Provident Fund (Employer Contribution)</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(annexureData.deductions.pf)}</td>
              </tr>
              <tr>
                <td className="border border-[#1C1917] py-3 px-4">Health Insurance Premium</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(annexureData.deductions.insurance)}</td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="border border-[#1C1917] py-3 px-4 text-right">Total Deductions (C)</td>
                <td className="border border-[#1C1917] py-3 px-4 text-right font-mono">{formatCurrency(deductionsTotal)}</td>
              </tr>

              {/* Grand Total */}
              <tr className="bg-[#F0FDF4] text-[#047857]">
                <td className="border border-[#1C1917] py-4 px-4 text-right font-bold text-base uppercase tracking-wider">Total Cost to Company (A + B)</td>
                <td className="border border-[#1C1917] py-4 px-4 text-right font-bold text-lg font-mono">{formatCurrency(grossTotal)}</td>
              </tr>
            </tbody>
          </table>

          {/* Terms */}
          <div className="text-xs text-gray-600 space-y-2 mb-16 leading-relaxed">
            <p><strong>Note:</strong></p>
            <p>1. All payments are subject to applicable statutory deductions and income tax.</p>
            <p>2. The Performance Bonus is indicative and payout depends on company and individual performance as per the prevailing policy.</p>
            <p>3. This annexure is strictly confidential and should not be discussed with anyone other than the HR department.</p>
          </div>

          {/* Signatures */}
          <div className="flex justify-between mt-auto pt-12">
            <div className="w-64">
              <div className="border-b border-dashed border-[#1C1917] h-12 mb-2"></div>
              <p className="font-bold text-sm">Accepted By</p>
              <p className="text-xs text-gray-500 mt-1">{annexureData.employee.name}</p>
              <p className="text-xs text-gray-500">Date: _______________</p>
            </div>
            <div className="w-64 text-right">
              <div className="border-b border-dashed border-[#1C1917] h-12 mb-2 flex items-end justify-end pb-1">
                <span className="font-serif italic text-xl text-gray-400">S. Jenkins</span>
              </div>
              <p className="font-bold text-sm">Authorized Signatory</p>
              <p className="text-xs text-gray-500 mt-1">Sarah Jenkins</p>
              <p className="text-xs text-gray-500">Human Resources</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
