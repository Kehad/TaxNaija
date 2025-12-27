import React, { useState } from "react";
import { Calculator, User, Building2 } from "lucide-react";
import { ResultsModal } from "../components/ResultModal";
import { Button } from "../components/Button";
import { InputGroup } from "../components/InputGroup";
import logos from "../assets/logo.png";
import bullet from "../assets/bullet.png";

// Interfaces
interface TaxBand {
  min: number;
  max: number;
  rate: number;
  label: string;
}

interface BreakdownItem {
  label: string;
  amount: string;
}

interface ResultData {
  grossIncome: string;
  taxBandBreakdown: BreakdownItem[];
  incomeTax: string;
  capitalGainsTax: string;
  totalTax: string;
  effectiveRate: string;
  netIncome: string;
}

const HomePage: React.FC = () => {
  const [payerType, setPayerType] = useState<"individual" | "company">(
    "individual"
  );
  const [showResults, setShowResults] = useState(false);


  // Form State (updated defaults for better testing with current rates)
  const [formData, setFormData] = useState({
    annualIncome: "",
    capitalGains: "",
    turnover: "",
    fixedAssets: "",
    profits: "",
  });

  // Result State
  const [resultData, setResultData] = useState<ResultData>({
    grossIncome: "₦0.00",
    taxBandBreakdown: [],
    incomeTax: "₦0.00",
    capitalGainsTax: "₦0.00",
    totalTax: "₦0.00",
    effectiveRate: "0.00%",
    netIncome: "₦0.00",
  });

  // Helper to parse currency string to number
  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/,/g, "")) || 0;
  };

  // Helper to format number to currency
  const formatCurrency = (value: number) => {
    return (
      "₦" +
      value.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers, commas, and dots
    const value = e.target.value.replace(/[^0-9,.]/g, "");
    setFormData({ ...formData, [e.target.name]: value });
  };

  // --- MAIN CALCULATION LOGIC (Updated for Dec 2025: Pre-2026 rules) ---
  const calculateTaxHandler = () => {
    if (payerType === "individual") {
      const income = parseCurrency(formData.annualIncome);
      const capGains = parseCurrency(formData.capitalGains);

      if (isNaN(income) || income < 0) {
        alert("Please enter a valid annual income.");
        return;
      }
      if (isNaN(capGains) || capGains < 0) {
        alert("Please enter a valid capital gains amount.");
        return;
      }

      let incomeTax = 0;
      const breakdown: BreakdownItem[] = [];

      // Current PAYE bands (as of Dec 2025)
      const bands: TaxBand[] = [
        { min: 0, max: 800000, rate: 0, label: "First ₦800,000 @ 0%" },
        {
          min: 800001,
          max: 3000000,
          rate: 0.15,
          label: "Next ₦2,200,000 @ 15%",
        },
        {
          min: 3000001,
          max: 12000000,
          rate: 0.18,
          label: "Next ₦9,000,000 @ 18%",
        },
        {
          min: 12000001,
          max: 25000000,
          rate: 0.21,
          label: "Next ₦13,000,000 @ 21%",
        },
        {
          min: 25000001,
          max: 50000000,
          rate: 0.23,
          label: "Next ₦25,000,000 @ 23%",
        },
        { min: 50000001, max: Infinity, rate: 0.25, label: "Taxed @ 25%" },
      ];

      const remainingIncome = income + capGains;
      let previousMax = 0;

      bands.forEach((band) => {
        if (remainingIncome > previousMax) {
          const taxableInBand = Math.min(
            remainingIncome - previousMax,
            band.max - previousMax
          );
          console.log("taxtinband", taxableInBand);
          if (taxableInBand > 0) {
            const taxForBand = taxableInBand * band.rate;
            console.log("taxforband", taxForBand);
            incomeTax += taxForBand;
            console.log("incometax", incomeTax);
            breakdown.push({
              label: `${band.label}: ${formatCurrency(taxableInBand)}`,
              amount: formatCurrency(taxForBand),
            });
          }
        }
        previousMax = band.max;
      });

      // Capital Gains Tax for individuals: 10% (current as of Dec 2025)
      // const capGainsTax = capGains * 0.1;

      // Totals
      const totalIncome = income + capGains;
      // const totalTax = incomeTax + capGainsTax;
      const totalTax = incomeTax;
      const netIncome = totalIncome - totalTax;
      const effectiveRate =
        totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

      setResultData({
        grossIncome: formatCurrency(totalIncome),
        taxBandBreakdown: breakdown,
        incomeTax: formatCurrency(incomeTax),
        capitalGainsTax: formatCurrency(0),
        totalTax: formatCurrency(totalTax),
        effectiveRate: effectiveRate.toFixed(2) + "%",
        netIncome: formatCurrency(netIncome),
      });

      setShowResults(true);
    } else {
      // Company Tax Calculation (current as of Dec 2025)
      const turnover = parseCurrency(formData.turnover);
      // const fixedAssets = parseCurrency(formData.fixedAssets); // Not directly used but kept for form
      const profits = parseCurrency(formData.profits);
      const capGains = parseCurrency(formData.capitalGains);

      if (isNaN(turnover) || turnover < 0) {
        alert("Please enter a valid annual turnover.");
        return;
      }
      if (isNaN(profits) || profits < 0) {
        alert("Please enter a valid annual profit.");
        return;
      }
      if (isNaN(capGains) || capGains < 0) {
        alert("Please enter a valid capital gains amount.");
        return;
      }

      // Determine CIT rate based on turnover (2025 rules)
      let citRate = 0;
      if (turnover <= 25000000) {
        citRate = 0; // Exempt
      } else if (turnover <= 100000000) {
        citRate = 0.2; // Medium: 20%
      } else {
        citRate = 0.3; // Large: 30%
      }

      // Corporate Income Tax
      const cit = profits * citRate;

      // Capital Gains Tax for companies: 10% (current)
      const capGainsTax = capGains * 0.1;

      // Total Tax (excluding separate levies like TET 3%)
      const totalTax = cit + capGainsTax;

      const totalIncome = profits + capGains;
      const netIncome = totalIncome - totalTax;
      const effectiveRate =
        totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

      const breakdown: BreakdownItem[] = [
        {
          label: `Corporate Income Tax: ${formatCurrency(profits)} @ ${
            citRate * 100
          }%`,
          amount: formatCurrency(cit),
        },
      ];

      if (capGains > 0) {
        breakdown.push({
          label: `Capital Gains Tax: ${formatCurrency(capGains)} @ 10%`,
          amount: formatCurrency(capGainsTax),
        });
      }

      setResultData({
        grossIncome: formatCurrency(turnover),
        taxBandBreakdown: breakdown,
        incomeTax: formatCurrency(cit),
        capitalGainsTax: formatCurrency(capGainsTax),
        totalTax: formatCurrency(totalTax),
        effectiveRate: effectiveRate.toFixed(2) + "%",
        netIncome: formatCurrency(netIncome),
      });

      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-[#E8F4E8] font-sans text-gray-800 flex items-center justify-center p-4 md:p-8 relative">
      {/* MODAL OVERLAY */}
      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        data={resultData}
      />

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logos} alt="The Logo" />
            </div>
            <span className="text-[24px] font-bold tracking-tight">
              TaxNaija
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black leading-tight text-black">
              Calculate Your Tax <br /> in Seconds
            </h1>
            <p className="text-black text-lg max-w-md">
              Ignore all the common misconceptions and know the exact tax
              required from your earnings.
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Using current Nigerian tax rules (as of December 2025). Major
              reforms take effect January 2026.
            </p>
          </div>

          <div>
            <Button>Calculate tax</Button>
          </div>

          <div className="mt-12">
            <h3 className="font-bold text-lg mb-4">Disclaimer</h3>
            <ul className="space-y-4 text-sm text-gray-700">
              <DisclaimerItem text="This is not official tax advice." />
              <DisclaimerItem text="This calculator is for estimation purposes only (pre-2026 rules)." />
              <DisclaimerItem text="Always verify with the Federal Inland Revenue Service (FIRS)." />
              <DisclaimerItem text="This website does not collect user data." />
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE: FORM CARD */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100 hover:shadow-3xl transition-shadow duration-300 ">
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
                      ? "bg-[#7CB518]/20 border border-[#7CB518] !text-black hover:bg-[#EBF3D6] shadow-none"
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
                      ? "bg-[#7CB518]/20 !text-black border border-[#6A8D26] text-black hover:bg-[#EBF3D6] shadow-none"
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
            <div key={payerType}>
              {payerType === "individual" ? (
                <>
                  <InputGroup
                    label="Annual income (₦)"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                  />
                  <InputGroup
                    label="Capital Gains (₦)"
                    name="capitalGains"
                    value={formData.capitalGains}
                    onChange={handleInputChange}
                    isOptional
                  />
                </>
              ) : (
                <>
                  <InputGroup
                    label="Annual Turnover (₦)"
                    name="turnover"
                    value={formData.turnover}
                    onChange={handleInputChange}
                  />
                  <InputGroup
                    label="Fixed Assets Value (₦)"
                    name="fixedAssets"
                    value={formData.fixedAssets}
                    onChange={handleInputChange}
                    isOptional
                  />
                  <InputGroup
                    label="Annual Profit (₦)"
                    name="profits"
                    value={formData.profits}
                    onChange={handleInputChange}
                  />
                  <InputGroup
                    label="Capital Gains (₦)"
                    name="capitalGains"
                    value={formData.capitalGains}
                    onChange={handleInputChange}
                    isOptional
                  />
                </>
              )}
            </div>

            <Button fullWidth icon={Calculator} onClick={calculateTaxHandler}>
              Calculate tax
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

const DisclaimerItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3">
    <span className="mt-1 shrink-0 w-3 h-3">
      <img src={bullet} alt="Bullet List" />
    </span>
    <span className="leading-snug">{text}</span>
  </li>
);

export default HomePage;
