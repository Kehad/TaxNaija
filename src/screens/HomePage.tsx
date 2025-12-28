import React, { useState } from "react";
import { Calculator, User, Building2, ShieldCheck } from "lucide-react";
import { ResultsModal } from "../components/ResultModal";
import { Button } from "../components/Button";
import { InputGroup } from "../components/InputGroup";
import fulllogo from "../assets/full-logo.png";
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
  isExempt?: boolean;
}

const HomePage: React.FC = () => {
  const [payerType, setPayerType] = useState<"individual" | "company">(
    "individual"
  );
  const [showResults, setShowResults] = useState(false);
  const [isExempt, setIsExempt] = useState<boolean>(false);

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
    isExempt: false,
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

      if (isNaN(income) || income < 0 || income === 0) {
        alert("Please enter a valid annual income.");
        return;
      }
      if (isNaN(capGains) || capGains < 0 || income === 0) {
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

      if (isNaN(turnover) || turnover < 0 || turnover === 0) {
        alert("Please enter a valid annual turnover.");
        console.log("dont open");
        return;
      }
      if (isNaN(profits) || profits < 0 || profits === 0) {
        console.log(profits);
        alert("Please enter a valid annual profit.");
        return;
      }
      if (isNaN(capGains) || capGains < 0) {
        alert("Please enter a valid capital gains amount.");
        return;
      }
      console.log("turnover", turnover);

      // let calculatedResult: TaxBreakdown = {
      //         cit: 0,
      //         educationTax: 0,
      //         cgt: 0,
      //         totalTax: 0,
      //         isExempt: false
      //       };

      //         if (turnover <= SMALL_COMPANY_THRESHOLD) {
      //           calculatedResult.isExempt = true;
      //           // Tax is 0 for CIT, Dev Levy, and CGT
      //         } else {
      //           // 2. Large Company Logic

      //           // CIT: 30% of Profits
      //           calculatedResult.cit = profits * 0.30;

      //           // Development Levy: 4% of Profits (Replaces Education Tax)
      //           calculatedResult.educationTax = profits * 0.04;

      //           // CGT: 30% of Capital Gains (Increased from 10%)
      //           calculatedResult.cgt = capitalGains * 0.30;

      //           calculatedResult.totalTax =
      //             calculatedResult.cit +
      //             calculatedResult.educationTax +
      //             calculatedResult.cgt;
      //         }

      // Determine CIT rate based on turnover (2025 rules)
      let citRate = 0;
      if (turnover <= 25000000) {
        citRate = 0; // Exempt
        setIsExempt(true);
       
        // return;
      }
      //  else if (turnover <= 100000000) {
      //   citRate = 0.2; // Medium: 20%
      // }
      else {
        setIsExempt(false)
        citRate = 0.3; // Large: 30%
        // Corporate Income Tax
        const cit = profits * citRate;
        // Capital Gains Tax for companies: 10% (current)
        const capGainsTax = capGains * 0.1;
        // Tertiary Education Tax: 2.5% on assessable profit
        const tet = profits * 0.025;
        // Total Tax (including TET 2.5%)
        const totalTax = cit + tet;
        // const totalTax = cit + capGainsTax + tet;
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
        breakdown.push({
          label: `Tertiary Education Tax: ${formatCurrency(profits)} @ 2.5%`,
          amount: formatCurrency(tet),
        });

        console.log(isExempt);
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
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F5F5F5] to-[#E8F4E8] font-sans text-gray-800 flex items-center justify-center p-4 md:p-8 relative">
      {/* MODAL OVERLAY */}
      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        data={resultData}
      />

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE */}
        <div className="space-y-8">
          {/* <div className="flex items-center gap-2"> */}
          <div className="w-40 h-25 flex b-red-400 items-center justify-center">
            <img
              src={fulllogo}
              alt="The Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {/* </div> */}

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
          <div className="bg-white p-8 rounded-4xl shadow-2xl w-full max-w-md border border-gray-100 hover:shadow-3xl transition-shadow duration-300 ">
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
                      ? "bg-[#7CB518]/20  border border-[#6A8D26] text-black! hover:bg-[#EBF3D6] shadow-none"
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
                    label="Annual Profit (₦)"
                    name="profits"
                    value={formData.profits}
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

            {isExempt && (
              <NoTaxDeducted />
            )}
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

const NoTaxDeducted = () => (
  <div className="flex items-center gap-4 rounded-xl  mt-10 border border-green-200 bg-green-50 p-4 shadow-sm">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
      <ShieldCheck size={24} />
    </div>
    <div className="text-left">
      <p className="font-bold text-green-900">Exempt from Companies Income Tax</p>
      <p className="text-sm text-green-700">
        Small Company (Turnover ≤ ₦25m)
      </p>
    </div>
  </div>
);

// import React, { useState } from 'react';
// import { User, Building2, Calculator, Loader2 } from 'lucide-react';
// import { InputGroup } from '../components/InputGroup';
// import { Button } from '../components/Button';

// // Define the shape of our calculation results
// type TaxBreakdown = {
//   cit: number;
//   educationTax: number; // Now "Development Levy"
//   cgt: number;
//   totalTax: number;
//   isExempt: boolean;
// };

// const HomePage = () => {
//   const [payerType, setPayerType] = useState<"individual" | "company">("individual");
//   const [isCalculating, setIsCalculating] = useState(false);

//   // Store results to display to the user
//   const [result, setResult] = useState<TaxBreakdown | null>(null);

//   const [formData, setFormData] = useState({
//     annualIncome: "",
//     capitalGains: "",
//     turnover: "",
//     fixedAssets: "",
//     profits: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     // Allow only numbers and decimal points
//     if (value && !/^\d*\.?\d*$/.test(value)) return;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCalculate = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsCalculating(true);
//     setResult(null);

//     setTimeout(() => {
//       // Parsing inputs
//       const income = parseFloat(formData.annualIncome) || 0;
//       const turnover = parseFloat(formData.turnover) || 0;
//       const profits = parseFloat(formData.profits) || 0;
//       const capitalGains = parseFloat(formData.capitalGains) || 0;

//       let calculatedResult: TaxBreakdown = {
//         cit: 0,
//         educationTax: 0,
//         cgt: 0,
//         totalTax: 0,
//         isExempt: false
//       };

//       if (payerType === "company") {
//         // --- NIGERIA TAX ACT 2025 LOGIC ---

//         // 1. Small Company Exemption (Turnover <= ₦100m)
//         const SMALL_COMPANY_THRESHOLD = 100_000_000;

//         if (turnover <= SMALL_COMPANY_THRESHOLD) {
//           calculatedResult.isExempt = true;
//           // Tax is 0 for CIT, Dev Levy, and CGT
//         } else {
//           // 2. Large Company Logic

//           // CIT: 30% of Profits
//           calculatedResult.cit = profits * 0.30;

//           // Development Levy: 4% of Profits (Replaces Education Tax)
//           calculatedResult.educationTax = profits * 0.04;

//           // CGT: 30% of Capital Gains (Increased from 10%)
//           calculatedResult.cgt = capitalGains * 0.30;

//           calculatedResult.totalTax =
//             calculatedResult.cit +
//             calculatedResult.educationTax +
//             calculatedResult.cgt;
//         }

//       } else {
//         // --- INDIVIDUAL LOGIC (Simplified PITA 2025 Bands) ---
//         // Using the new bands mentioned in Act 2025
//         // 0-800k: 0% | 800k-3m: 15% | 3m-12m: 18% | 12m-25m: 21% | 25m-50m: 23% | >50m: 25%

//         const taxableIncome = income; // Assuming "Annual Income" is roughly taxable for this demo
//         let tax = 0;

//         // Note: This is a simplified marginal tax calculation
//         if (taxableIncome > 50_000_000) {
//             tax += (taxableIncome - 50_000_000) * 0.25;
//             tax += (50_000_000 - 25_000_000) * 0.23;
//             tax += (25_000_000 - 12_000_000) * 0.21;
//             tax += (12_000_000 - 3_000_000) * 0.18;
//             tax += (3_000_000 - 800_000) * 0.15;
//         } else if (taxableIncome > 25_000_000) {
//             tax += (taxableIncome - 25_000_000) * 0.23;
//             tax += (25_000_000 - 12_000_000) * 0.21;
//             tax += (12_000_000 - 3_000_000) * 0.18;
//             tax += (3_000_000 - 800_000) * 0.15;
//         } else if (taxableIncome > 12_000_000) {
//             tax += (taxableIncome - 12_000_000) * 0.21;
//             tax += (12_000_000 - 3_000_000) * 0.18;
//             tax += (3_000_000 - 800_000) * 0.15;
//         } else if (taxableIncome > 3_000_000) {
//             tax += (taxableIncome - 3_000_000) * 0.18;
//             tax += (3_000_000 - 800_000) * 0.15;
//         } else if (taxableIncome > 800_000) {
//             tax += (taxableIncome - 800_000) * 0.15;
//         }

//         calculatedResult.totalTax = tax;
//       }

//       setResult(calculatedResult);
//       setIsCalculating(false);
//     }, 600);
//   };

//   const formatCurrency = (val: number) =>
//     new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

//   const getToggleStyles = (isActive: boolean) =>
//     isActive
//       ? "bg-[#7CB518]/20 border border-[#7CB518] text-black hover:bg-[#EBF3D6] shadow-sm ring-1 ring-[#7CB518]"
//       : "text-gray-500 hover:text-gray-700 border-gray-200";

//   return (
//     <div className="flex justify-center lg:justify-end">
//       <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100 hover:shadow-3xl transition-all duration-300">

//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold text-gray-900">Tax Calculator</h2>
//         </div>

//         <form onSubmit={handleCalculate}>
//           {/* Payer Type Toggle */}
//           <div className="mb-8">
//             <label className="block text-sm font-semibold mb-3 text-gray-700">Tax payer type</label>
//             <div className="grid grid-cols-2 gap-4 p-1 bg-gray-50 rounded-xl border border-gray-100">
//               <Button
//                 type="button"
//                 variant="ghost"
//                 className={`transition-all duration-200 ${getToggleStyles(payerType === "individual")}`}
//                 onClick={() => { setPayerType("individual"); setResult(null); }}
//                 icon={User}
//               >
//                 Individual
//               </Button>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 className={`transition-all duration-200 ${getToggleStyles(payerType === "company")}`}
//                 onClick={() => { setPayerType("company"); setResult(null); }}
//                 icon={Building2}
//               >
//                 Company
//               </Button>
//             </div>
//           </div>

//           {/* Form Fields */}
//           <div className="space-y-4 mb-8">
//             {payerType === "individual" ? (
//               <>
//                 <InputGroup
//                   label="Annual Income (₦)"
//                   name="annualIncome"
//                   value={formData.annualIncome}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 <InputGroup
//                   label="Capital Gains (₦)"
//                   name="capitalGains"
//                   value={formData.capitalGains}
//                   onChange={handleInputChange}
//                   isOptional
//                 />
//               </>
//             ) : (
//               <>
//                 <InputGroup
//                   label="Annual Turnover (₦)"
//                   name="turnover"
//                   value={formData.turnover}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Exemption if ≤ 100,000,000"
//                 />
//                 <InputGroup
//                   label="Assessable Profit (₦)"
//                   name="profits"
//                   value={formData.profits}
//                   onChange={handleInputChange}
//                   required
//                 />
//                  <InputGroup
//                   label="Capital Gains (₦)"
//                   name="capitalGains"
//                   value={formData.capitalGains}
//                   onChange={handleInputChange}
//                   isOptional
//                 />
//                 <InputGroup
//                     label="Fixed Assets (₦)"
//                     name="fixedAssets"
//                     value={formData.fixedAssets}
//                     onChange={handleInputChange}
//                     isOptional
//                   />
//               </>
//             )}
//           </div>

//           <Button
//             fullWidth
//             type="submit"
//             disabled={isCalculating}
//             className="bg-[#7CB518] hover:bg-[#6A9D15] text-white transition-transform active:scale-[0.98]"
//           >
//             {isCalculating ? (
//               <span className="flex items-center justify-center gap-2">
//                 <Loader2 className="animate-spin h-5 w-5" /> Calculating...
//               </span>
//             ) : (
//               <span className="flex items-center justify-center gap-2">
//                 <Calculator className="h-5 w-5" /> Calculate Tax
//               </span>
//             )}
//           </Button>

//           {/* Results Display */}
//           {result && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
//                 {result.isExempt ? (
//                     <div className="text-center text-green-700">
//                         <p className="font-bold text-lg">Exempt from Tax</p>
//                         <p className="text-sm">Small Company (Turnover ≤ ₦100m)</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-2">
//                         {payerType === 'company' && (
//                             <>
//                                 <div className="flex justify-between text-sm text-gray-600">
//                                     <span>CIT (30%)</span>
//                                     <span>{formatCurrency(result.cit)}</span>
//                                 </div>
//                                 <div className="flex justify-between text-sm text-gray-600">
//                                     <span>Dev. Levy (4%)</span>
//                                     <span>{formatCurrency(result.educationTax)}</span>
//                                 </div>
//                                 <div className="flex justify-between text-sm text-gray-600">
//                                     <span>CGT (30%)</span>
//                                     <span>{formatCurrency(result.cgt)}</span>
//                                 </div>
//                                 <div className="h-px bg-gray-200 my-2" />
//                             </>
//                         )}
//                         <div className="flex justify-between font-bold text-gray-900 text-lg">
//                             <span>Total Tax</span>
//                             <span>{formatCurrency(result.totalTax)}</span>
//                         </div>
//                     </div>
//                 )}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
