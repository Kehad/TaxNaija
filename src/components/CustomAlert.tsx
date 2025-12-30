import React from "react";

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string; // e.g., "localhost:5173" or "System Notification"
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  onClose,
  message,
  title = "Notification",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:items-center sm:pt-0 animate-in fade-in duration-300">
      {/* Enhanced Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal Container with Enhanced Styling */}
      <div className="relative z-10 w-full max-w-[420px] transform rounded-xl bg-gradient-to-br from-[#2B2D31] to-[#1E1F23] p-6 text-left shadow-2xl transition-all duration-300 border border-gray-700/60 animate-in zoom-in-95 duration-300">
        {/* Header with Alert Icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A896] shadow-lg">
            <AlertIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-semibold text-white font-mono tracking-wide">
            {title}
          </span>
        </div>

        {/* Message Body with Better Typography */}
        <div className="mb-7">
          <p className="text-[15px] text-gray-200 leading-relaxed">{message}</p>
        </div>

        {/* Footer / Button with Enhanced Styling */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gradient-to-r from-[#00D1C1] to-[#00A896] px-8 py-2.5 text-sm font-semibold text-black hover:from-[#00BFA5] hover:to-[#009B86] focus:outline-none focus:ring-2 focus:ring-[#00D1C1] focus:ring-offset-2 focus:ring-offset-[#2B2D31] transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Alert Icon Component
const AlertIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default CustomAlert;
