import { twMerge } from "tailwind-merge";

const LabelForm = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        // Clases por defecto
        "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 text-center",

        // Clases adicionales que pueden sobreescribir las predeterminadas
        className
      )}
    >
      {children}
    </label>
  );
};

export default LabelForm;