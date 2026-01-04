import React from "react";
import { Button } from "../components/Button";
import fulllogo from "../assets/full-logo.png";
import bullet from "../assets/bullet.png";

const DisclaimerItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3">
    <span className="mt-1 shrink-0 w-3 h-3">
      <img src={bullet} alt="Bullet List" />
    </span>
    <span className="leading-snug">{text}</span>
  </li>
);

interface HeroSectionProps {
  onCalculateClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCalculateClick }) => {
  return (
    <div className="space-y-8">
      <div className="w-40 h-25 flex b-red-400 items-center justify-center">
        <img
          src={fulllogo}
          alt="The Logo"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-black leading-tight text-black">
          Calculate Your Tax <br /> in Seconds
        </h1>
        <p className="text-black text-lg max-w-md">
          Ignore all the common misconceptions and know the exact tax required
          from your earnings.
        </p>
        <p className="text-sm text-gray-600 mt-4">
          Using current Nigerian tax rules (as of December 2025). Major reforms
          take effect January 2026.
        </p>
      </div>

      <div>
        <Button onClick={onCalculateClick}>Calculate tax</Button>
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
  );
};

export default HeroSection;
