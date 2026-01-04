import React, { useState } from "react";
import { ArrowLeft, Info, ChevronDown, ChevronUp } from "lucide-react";

interface BreakdownItem {
  label: string;
  amount: string;
}

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    paperType?: "individual" | "company";
    grossIncome: string;
    // Added for the new UI
    taxableIncome: string;
    deductions: BreakdownItem[];
    // Existing fields
    taxBandBreakdown: BreakdownItem[];
    incomeTax: string;
    chargeableGainsTax?: string;
    totalTax: string;
    effectiveRate: string;
    netIncome: string;
  };
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [showDeductibles, setShowDeductibles] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 font-medium text-sm mb-6 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Calculator
        </button>

        <h2 className="text-2xl font-bold mb-4">Tax Calculation Results</h2>

        {/* Info Banner */}
        <div className="bg-[#f0fdf4] border border-green-100 rounded-lg p-4 mb-6 flex gap-3">
          <Info className="text-[#6A8D26] shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-[#4d6b16] leading-relaxed">
            Based on the Nigeria Tax Act effective January 1, 2026. This
            calculator provides estimates for planning purposes.
          </p>
        </div>

        <div className="space-y-4">
          {/* Annual Income */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Annual income:</span>
            <span className="font-bold text-gray-900">{data.grossIncome}</span>
          </div>

          {/* Deductibles Accordion */}
          {data.paperType === "individual" && (
            <div>
              <button
                onClick={() => setShowDeductibles(!showDeductibles)}
                className="w-full flex justify-between items-center bg-[#EBF3D6] p-3 rounded-lg text-sm text-gray-800 font-medium hover:bg-[#dce8b5] transition-colors"
              >
                <span>Deductibles</span>
                {showDeductibles ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {showDeductibles && (
                <div className="bg-[#F7FAE9] mt-1 rounded-lg p-4 text-sm text-gray-600 space-y-2 border border-[#EBF3D6]">
                  {data.deductions && data.deductions.length > 0 ? (
                    data.deductions.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-xs md:text-sm"
                      >
                        <span>{item.label}</span>
                        <span className="font-medium text-gray-900">
                          {item.amount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 italic">
                      No deductions applied
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Income After Deductions */}
          {data.paperType === "individual" && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Income after Deductions</span>
              <span className="font-bold text-gray-900">
                {data.taxableIncome}
              </span>
            </div>
          )}

          {/* Tax Breakdown Accordion */}
          <div>
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex justify-between items-center bg-gray-100 p-3 rounded-lg text-sm text-gray-800 font-medium hover:bg-gray-200 transition-colors"
            >
              <span>Tax Breakdown by Band:</span>
              {showBreakdown ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {showBreakdown && (
              <div className="bg-gray-50 mt-1 rounded-lg p-4 text-sm text-gray-600 space-y-2 border border-gray-100">
                {data.taxBandBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-xs md:text-sm"
                  >
                    <span>{item.label}</span>
                    <span className="font-medium text-gray-900">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Income Tax Row */}
          <div className="flex justify-between items-center text-sm pt-2">
            <span className="text-gray-400">Income Tax:</span>
            <span className="font-bold text-gray-900">{data.incomeTax}</span>
          </div>

          {/* Chargeable Gains (Optional) */}
          {data.chargeableGainsTax && data.chargeableGainsTax !== "₦0.00" && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Chargeable Gain Tax (10%):</span>
              <span className="font-bold text-gray-900">
                {data.chargeableGainsTax}
              </span>
            </div>
          )}

          {/* Totals Section */}
          <div className="flex justify-between items-center text-base pt-1 border-t border-gray-100 mt-2">
            <span className="font-bold text-gray-900">Total Tax:</span>
            <span className="font-bold text-black text-lg">
              {data.totalTax}
            </span>
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
