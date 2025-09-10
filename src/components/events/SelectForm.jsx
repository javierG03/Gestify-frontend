const SelectForm = ({ options, placeholder = "Select an option", onChange, className = "" }) => {
  return (
    <div className="flex justify-center">
      <select
        className={`w-140 h-11 rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300 ${className}`}
        onChange={(e) => onChange(e.target.value)}
      >
        {/* Opción Placeholder */}
        <option value="" disabled className="text-gray-700">
          {placeholder}
        </option>

        {/* Opciones del Select */}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-gray-700">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectForm;