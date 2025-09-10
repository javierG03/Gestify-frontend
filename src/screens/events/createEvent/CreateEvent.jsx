import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Tabs from "./tabs/Tabs";

const sections = [
  { id: "evento", name: "Detalles", path: "evento" },
  { id: "tipoEvento", name: "Logistica", path: "tipoEvento" },
  { id: "ubicacion", name: "Ubicación", path: "ubicacion" }
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentSection = location.pathname.split("/").pop(); // Extrae la tab actual

  const [formData, setFormData] = useState({ evento: {} });
  const [completedSections, setCompletedSections] = useState({});

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const markSectionCompleted = (section) => {
    setCompletedSections(prev => ({ ...prev, [section]: true }));
  };

  const goToPreviousSection = () => {
    const currentIndex = sections.findIndex(s => s.path === currentSection);
    if (currentIndex > 0) {
      navigate(sections[currentIndex - 1].path);
    }
  };

  // ✅ Botón cancelar: limpia sessionStorage y redirige
  const handleCancel = () => {
    sessionStorage.removeItem("eventData");
    sessionStorage.removeItem("tab_tipoEvento_data");
    sessionStorage.removeItem("tab_ubicacion_data");
    navigate("/dashboard/events");
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="relative top-0 z-10 p-4">
        {/* Cabecera: botón izquierda + título centrado */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Solo mostrar botón si estamos en la primera tab */}
          {currentSection === "evento" && (
            <button
              onClick={handleCancel}
              className="absolute left-0 text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
            >
              Cancelar
            </button>
          )}

          {/* Título centrado */}
          <h1 className="text-2xl font-bold text-center">Creación de evento</h1>
        </div>

        <Tabs
          sections={sections}
          currentPath={currentSection}
          completed={completedSections}
        />
      </div>

      <div className="flex-grow p-4">
        <Outlet
          context={{
            formData,
            updateFormData,
            markSectionCompleted,
            goToPreviousSection,
            currentSection
          }}
        />
      </div>
    </div>
  );
};

export default CreateEvent;