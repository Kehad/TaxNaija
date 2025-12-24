import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';

interface BreakdownItem {
  label: string;
  amount: string;
}

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    grossIncome: string;
    taxBandBreakdown: BreakdownItem[];
    incomeTax: string;
    capitalGainsTax: string;
    totalTax: string;
    effectiveRate: string;
    netIncome: string;
  };
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[1.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 font-medium text-sm mb-6 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Calculator
        </button>

        <h2 className="text-2xl font-bold mb-4">Tax Calculation Results</h2>

        <div className="bg-[#f0fdf4] border border-green-100 rounded-lg p-4 mb-6 flex gap-3">
          <Info className="text-[#6A8D26] shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-[#4d6b16] leading-relaxed">
            Based on the Nigeria Tax Act effective January 1, 2026. This calculator provides estimates for planning purposes.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Annual income:</span>
            <span className="font-bold text-gray-900">{data.grossIncome}</span>
          </div>

          {/* DYNAMIC TAX BAND BOX */}
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600 space-y-2">
            <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tax Breakdown by Band:</div>
            
            {data.taxBandBreakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-xs md:text-sm">
                <span>{item.label}</span>
                <span className="font-medium text-gray-900">{item.amount}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm pt-2">
            <span className="text-gray-500">Income Tax:</span>
            <span className="font-bold text-gray-900">{data.incomeTax}</span>
          </div>

          {data.capitalGainsTax !== '₦0.00' && (
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Capital Gain Tax (10%):</span>
                <span className="font-bold text-gray-900">{data.capitalGainsTax}</span>
             </div>
          )}

          <div className="flex justify-between items-center text-base pt-1 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total Tax:</span>
            <span className="font-bold text-black text-lg">{data.totalTax}</span>
          </div>

          <div className="bg-[#EBF3D6] rounded-lg p-3 flex justify-between items-center text-sm font-medium text-gray-800">
             <span>Effective Tax Rate:</span>
             <span>{data.effectiveRate}</span>
          </div>

          <div className="bg-[#5D8010] rounded-lg p-4 flex justify-between items-center text-white font-bold shadow-lg shadow-[#5D8010]/20">
             <span>Net Income After Tax:</span>
             <span className="text-lg">{data.netIncome}</span>
          </div>
        </div>
      </div>
    </div>
  );
};