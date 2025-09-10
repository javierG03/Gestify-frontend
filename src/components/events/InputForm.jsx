const InputForm = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
}) => {
  let inputClasses = `h-11 rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-50 bg-gray-100 cursor-not-allowed`;
  } else if (error) {
    inputClasses += ` border-red-500 focus:border-red-400 focus:ring-red-400`;
  } else if (success) {
    inputClasses += ` border-green-500 focus:border-green-400 focus:ring-green-400`;
  } else {
    inputClasses += ` bg-white text-gray-900 border-gray-300 focus:border-blue-400 focus:ring-blue-400`;
  }

  return (
    <div className="flex">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
      />

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-red-500"
              : success
              ? "text-green-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default InputForm;