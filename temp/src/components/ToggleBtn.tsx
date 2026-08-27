import React from "react";

interface ToggleProps {
  state: boolean;
  setter:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((value: boolean) => void);
  children: string;
}

const ToggleBtn: React.FC<ToggleProps> = ({ state, setter, children }) => {
  return (
    <button
      className={`h-full w-full border-2 border-white-primary bg-black-primary transition-colors ease-steps2 ${state && "bg-white-primary text-black-primary"}`}
      onClick={() => setter(!state)}
      type="button"
    >
      {children}
    </button>
  );
};

export default ToggleBtn;
