import React, { useState } from "react";
import {
  Calculator,
  User,
  Building2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../components/Button";
import { InputGroup } from "../components/InputGroup";
import type { FormData } from "../utils/type";

interface TaxCalculatorFormProps {
  payerType: "individual" | "company";
  setPayerType: (type: "individual" | "company") => void;
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculate: () => void;
  isExempt: boolean;
}

const NoTaxDeducted = () => (
  <div className="flex items-center gap-4 rounded-xl mt-10 border border-green-200 bg-green-50 p-4 shadow-sm">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
      <ShieldCheck size={24} />
    </div>
    <div className="text-left">
      <p className="font-bold text-green-900">
        Exempt from Companies Income Tax
      </p>
      <p className="text-sm text-green-700">Small Company (Turnover ≤ ₦25m)</p>
    </div>
  </div>
);

const TaxCalculatorForm: React.FC<TaxCalculatorFormProps> = ({
  payerType,
  setPayerType,
  formData,
  onInputChange,
  onCalculate,
  isExempt,
}) => {
  // State to toggle the deductions section
  const [showDeductions, setShowDeductions] = useState(false);

  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <div
      className="flex justify-center lg:justify-end"
    >
      <div className="bg-white p-8 rounded-4xl shadow-2xl w-full max-w-md border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
        <h2 className="text-xl font-bold mb-6">Tax Calculator</h2>

        {/* Payer Type Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Tax payer type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={payerType === "individual" ? undefined : "outline"}
              className={
                payerType === "individual"
                  ? "bg-[#7CB518]/20 border border-[#7CB518] text-black! hover:bg-[#EBF3D6] shadow-none"
                  : ""
              }
              onClick={() => setPayerType("individual")}
              icon={User}
            >
              Individual
            </Button>
            <Button
              variant={payerType === "company" ? undefined : "outline"}
              className={
                payerType === "company"
                  ? "bg-[#7CB518]/20 border border-[#6A8D26] text-black! hover:bg-[#EBF3D6] shadow-none"
                  : ""
              }
              onClick={() => setPayerType("company")}
              icon={Building2}
            >
              Company
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {payerType === "individual" ? (
            <>
              <InputGroup
                label="Annual income (₦)"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={onInputChange}
              />
              <InputGroup
                label="Chargeable Gains (₦)"
                name="chargeableGains"
                value={formData.chargeableGains}
                onChange={onInputChange}
                isOptional
              />

              {/* Collapsible Deductions Section */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeductions(!showDeductions)}
                  className="w-full flex items-center justify-between p-3 bg-[#EBF3D6] text-gray-800 rounded-lg hover:bg-[#dce8b5] transition-colors text-sm font-medium"
                >
                  <span>
                    Add Deductions such as Rents, Pensions, Insurance etc.
                  </span>
                  {showDeductions ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                {showDeductions && (
                  <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <InputGroup
                      label="Rents (₦)"
                      name="rents"
                      value={formData.rents || ""}
                      onChange={onInputChange}
                      isOptional
                    />
                    <InputGroup
                      label="Pensions (₦)"
                      name="pensions"
                      value={formData.pensions || ""}
                      onChange={onInputChange}
                      isOptional
                    />
                    <InputGroup
                      label="Health Insurance (₦)"
                      name="healthInsurance"
                      value={formData.healthInsurance || ""}
                      onChange={onInputChange}
                      isOptional
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <InputGroup
                label="Gross Turnover (₦)"
                name="turnover"
                value={formData.turnover}
                onChange={onInputChange}
              />
              <InputGroup
                label="Fixed Assets Value (₦)"
                name="fixedAssets"
                value={formData.fixedAssets}
                onChange={onInputChange}
              />
              <InputGroup
                label="Annual Profit (₦)"
                name="profits"
                value={formData.profits}
                onChange={onInputChange}
              />
              <InputGroup
                label="Chargeable Gains (₦)"
                name="chargeableGains"
                value={formData.chargeableGains}
                onChange={onInputChange}
                isOptional
              />
            </>
          )}
          <div className="mt-8">
            <Button
              type="submit"
              fullWidth
              icon={Calculator}
              onClick={() => onCalculate()}
            >
              Calculate tax
            </Button>
          </div>
        </form>

        {/* <div className="mt-8">
            <Button type="submit" fullWidth icon={Calculator} onClick={() => onCalculate()}>
            Calculate tax
            </Button>
        </div> */}

        {isExempt && <NoTaxDeducted />}
      </div>
    </div>
  );
};

export default TaxCalculatorForm;
