import { useState } from "react";
import type { FormData } from "../utils/type";

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
  taxableIncome: string;
  deductions: BreakdownItem[];
  taxBandBreakdown: BreakdownItem[];
  incomeTax: string;
  chargeableGainsTax?: string;
  totalTax: string;
  effectiveRate: string;
  netIncome: string;
  isExempt?: boolean;
  paperType?: "individual" | "company";
}

export const useTaxCalculator = () => {
  const [showResults, setShowResults] = useState(false);
  const [isExempt, setIsExempt] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState<FormData>({
    annualIncome: "",
    chargeableGains: "",
    turnover: "",
    fixedAssets: "",
    profits: "",
    rents: "",
    pensions: "",
    healthInsurance: "",
  });

  // Result State
  const [resultData, setResultData] = useState<ResultData>({
    grossIncome: "₦0.00",
    taxableIncome: "₦0.00",
    deductions: [],
    taxBandBreakdown: [],
    incomeTax: "₦0.00",
    totalTax: "₦0.00",
    chargeableGainsTax: "₦0.00",
    effectiveRate: "0.00%",
    netIncome: "₦0.00",
    isExempt: false,  
  });

  // Helper to parse currency string to number
  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/,/g, "")) || 0;
  };

  // Helper to format input with commas as thousands separators
  const formatInputWithCommas = (val: string) => {
    if (!val) return "";
    // Remove all chars except digits and dot
    const cleaned = val.replace(/[^0-9.]/g, "");
    // If empty after cleaning
    if (cleaned === "") return "";
    // Split integer and decimal parts
    const parts = cleaned.split(".");
    const intPart = parts[0].replace(/^0+(?=\d)/, "");
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const decPart = parts[1] ? "." + parts[1].slice(0, 2) : "";
    return withCommas + decPart;
  };

  // Helper to format number to currency
  const formatCurrency = (value: number) => {
    const formatted = value.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `₦${formatted}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatInputWithCommas(raw);
    setFormData({ ...formData, [e.target.name]: formatted });
  };

  const calculateIndividualTax = () => {
    const income = parseCurrency(formData.annualIncome);
    const capGains = parseCurrency(formData.chargeableGains);
    const rents = parseCurrency(formData.rents);
    const pensions = parseCurrency(formData.pensions);
    const healthInsurance = parseCurrency(formData.healthInsurance);

    console.log({ rents, pensions, healthInsurance });
    // Calculate taxable income after deductions//
    if (isNaN(rents) || rents < 0) {
      setAlertMessage("Please enter a valid rent amount.");
      setAlertOpen(true);
      return false;
    }
    if (isNaN(pensions) || pensions < 0) {
      setAlertMessage("Please enter a valid pension amount.");
      setAlertOpen(true);
      return false;
    }
    if (isNaN(healthInsurance) || healthInsurance < 0) {
      setAlertMessage("Please enter a valid health insurance amount.");
      setAlertOpen(true);
      return false;
    }
    let totalDeductions = 0;
    const deductions: BreakdownItem[] = [];

    // Add pensions deduction
    if (pensions > 0) {
      totalDeductions += pensions;
      deductions.push({
        label: "Pensions",
        amount: formatCurrency(pensions),
      });
    }

    // Add health insurance deduction
    if (healthInsurance > 0) {
      totalDeductions += healthInsurance;
      deductions.push({
        label: "Health Insurance",
        amount: formatCurrency(healthInsurance),
      });
    }

   

    if (rents * 0.2 > 500000) {
      totalDeductions += 500000;
      deductions.push({
        label: "Rents (above ₦500,000 threshold)",
        amount: formatCurrency(500000),
      });
    }

    if (isNaN(income) || income < 0 || income === 0) {
      setAlertMessage("Please enter a valid annual income.");
      setAlertOpen(true);
      return false;
    }
    if (isNaN(capGains) || capGains < 0) {
      setAlertMessage("Please enter a valid chargeable gains amount.");
      setAlertOpen(true);
      return false;
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

    const totalIncome = income + capGains;
    const taxableIncome = Math.max(totalIncome - totalDeductions, 0);
    console.log({ income, taxableIncome, totalDeductions });
    
    // const totalTaxableIncome = taxableIncome + capGains; 
    let previousMax = 0;


    bands.forEach((band) => {
      if (taxableIncome > previousMax) {
        const taxableInBand = Math.min(
          taxableIncome - previousMax,
          band.max - previousMax
        );
        if (taxableInBand > 0) {
          const taxForBand = taxableInBand * band.rate;
          incomeTax += taxForBand;
          breakdown.push({
            label: `${band.label}: ${formatCurrency(taxableInBand)}`,
            amount: formatCurrency(taxForBand),
          });
        }
      }
      previousMax = band.max;
    });
        const totalTax = incomeTax;
    const netIncome = taxableIncome - totalTax;
    const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;
    

    // Totals

    setResultData({
      grossIncome: formatCurrency(totalIncome),
      taxableIncome: formatCurrency(taxableIncome),
      deductions: deductions,
      taxBandBreakdown: breakdown,
      incomeTax: formatCurrency(incomeTax),
      chargeableGainsTax: formatCurrency(0),
      totalTax: formatCurrency(totalTax),
      effectiveRate: effectiveRate.toFixed(2) + "%",
      netIncome: formatCurrency(netIncome),
      paperType: "individual",
    });

    return true;
  };

  const calculateCompanyTax = () => {
    const turnover = parseCurrency(formData.turnover);
    const fixedAssets = parseCurrency(formData.fixedAssets);
    const profits = parseCurrency(formData.profits);
    const capGains = parseCurrency(formData.chargeableGains);

    if (isNaN(turnover) || turnover < 0 || turnover === 0) {
      setAlertMessage("Please enter a valid annual turnover.");
      setAlertOpen(true);
      return false;
    }
    if (isNaN(profits) || profits < 0 || profits === 0) {
      setAlertMessage("Please enter a valid annual profit.");
      setAlertOpen(true);
      return false;
    }
    if (isNaN(capGains) || capGains < 0) {
      setAlertMessage("Please enter a valid chargeable gains amount.");
      setAlertOpen(true);
      return false;
    }
    if (isNaN(fixedAssets) || fixedAssets < 0 || fixedAssets === 0) {
      setAlertMessage("Please enter a valid fixed assets amount.");
      setAlertOpen(true);
      return false;
    }

    const TURNOVER_THRESHOLD = 5000000;
    const FIXED_ASSETS_THRESHOLD = 250000000;

    // Determine CIT rate based on turnover (2025 rules)
    let citRate = 0;

    if (
      turnover <= TURNOVER_THRESHOLD &&
      fixedAssets <= FIXED_ASSETS_THRESHOLD
    ) {
      citRate = 0; // Exempt
      setIsExempt(true);
      return null; // Early return for exempt companies
    } else {
      setIsExempt(false);
      citRate = 0.3; // Large: 30%

      // --- Total Income ---
      const totalIncome = profits + capGains;

      // 1. Don't double tax Chargeable Gains. Calculate CIT on profits only.
      const cit = totalIncome * citRate;

      // 2. Chargeable Gains Tax is separate (usually 10%)
      const capGainsTax = capGains * 0.1;

      // 3. Tertiary Education Tax (2.5% or 3% depending on year)
      const tet = totalIncome * 0.04;

      const totalTax = cit + tet;
      const netIncome = totalIncome - totalTax;

      const effectiveRate =
        totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

      const breakdown: BreakdownItem[] = [
        {
          label: `Company Income Tax: ${formatCurrency(profits)} @ ${
            citRate * 100
          }%`,
          amount: formatCurrency(cit),
        },
        {
          label: `Development Levy: ${formatCurrency(profits)} @ 4%`,
          amount: formatCurrency(tet),
        },
      ];

      setResultData({
        grossIncome: formatCurrency(totalIncome),
        taxableIncome: formatCurrency(totalIncome), // No deductions for companies
        deductions: [], // No deductions for companies
        chargeableGainsTax: formatCurrency(capGainsTax),
        taxBandBreakdown: breakdown,
        incomeTax: formatCurrency(cit),
        totalTax: formatCurrency(totalTax),
        effectiveRate: effectiveRate.toFixed(2) + "%",
        netIncome: formatCurrency(netIncome),
        paperType: "company",
      });

      return true;
    }
  };

  const calculateTaxHandler = (payerType: "individual" | "company") => {
    let success: boolean | null = false;
    if (payerType === "individual") {
      success = calculateIndividualTax();
    } else {
      success = calculateCompanyTax();
    }

    if (success) {
      setShowResults(true);
    }
  };

  return {
    formData,
    resultData,
    showResults,
    setShowResults,
    isExempt,
    alertOpen,
    setAlertOpen,
    alertMessage,
    handleInputChange,
    calculateTaxHandler,
  };
};
