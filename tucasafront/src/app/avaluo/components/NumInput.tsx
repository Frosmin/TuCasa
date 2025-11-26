import React from "react";

interface NumInputProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}

const NumInput = ({ setValue, value }: NumInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div>
      <input
        type="number"
        name="celular"
        value={value}
        onChange={handleChange}
        placeholder="69509997"
        required
        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
};

export default NumInput;
