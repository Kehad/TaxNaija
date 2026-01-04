import React, { useState } from "react";
import { ResultsModal } from "../components/ResultModal";
import CustomAlert from "../components/CustomAlert";
import HeroSection from "../components/HeroSection";
import TaxCalculatorForm from "../components/TaxCalculatorForm";
import { useTaxCalculator } from "../hooks/useTaxCalculator";

const HomePage: React.FC = () => {
  const [payerType, setPayerType] = useState<"individual" | "company">(
    "individual"
  );

  const {
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
  } = useTaxCalculator();

  const handleCalculateClick = () => {
    // Scroll to form or focus on calculate button
    const formElement = document.querySelector("[data-form-section]");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
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
        <HeroSection onCalculateClick={handleCalculateClick} />

        {/* RIGHT SIDE: FORM CARD */}
        <div data-form-section>
          <TaxCalculatorForm
            payerType={payerType}
            setPayerType={setPayerType}
            formData={formData}
            onInputChange={handleInputChange}
            onCalculate={() => calculateTaxHandler(payerType)}
            isExempt={isExempt}
          />
        </div>
      </main>

      <CustomAlert
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </div>
  );
};

export default HomePage;
