import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * A reusable BackButton component using React Router and Tailwind CSS.
 *
 * @param {{ label?: string }} props
 * @returns {JSX.Element}
 */
export default function BackButton({ label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/dashboard/events`)}
      className="inline-flex items-center px-4 py-2 text-black font-semibold text-md hover:underline"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      <span>{label}</span>
    </button>
  );
}
