import React from "react";

export type DropdownOption = {
  key: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  selected: boolean;
};

interface DropdownProps {
  options: DropdownOption[];
  onToggle: (key: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onToggle }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-44 border border-gray-100 animate-fade-in">
      <div className="flex flex-col gap-3">
        {options.map(opt => (
          <button
            key={opt.key}
            className={`flex items-center justify-between px-2 py-2 rounded-lg transition-colors ${opt.enabled ? "hover:bg-gray-100 cursor-pointer" : "opacity-50 cursor-not-allowed"} ${opt.selected ? "bg-gray-200" : ""}`}
            disabled={!opt.enabled}
            onClick={() => opt.enabled && onToggle(opt.key)}
            type="button"
          >
            <span className="flex items-center gap-2">{opt.icon} {opt.label}</span>
            <span className="ml-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={opt.selected}
                  disabled={!opt.enabled}
                  onChange={() => opt.enabled && onToggle(opt.key)}
                  className="sr-only"
                />
                <span
                  className={`w-8 h-5 flex items-center rounded-full transition-colors duration-200 ${opt.selected ? "bg-indigo-500" : "bg-gray-300"} ${!opt.enabled ? "opacity-50" : ""}`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${opt.selected ? "translate-x-3" : "translate-x-0"}`}
                  />
                </span>
              </label>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
