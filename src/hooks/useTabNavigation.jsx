import { useNavigate } from "react-router-dom";

const sections = [
  { id: "evento", name: "Evento", path: "/dashboard/events/create-event/evento" },
  { id: "tipoEvento", name: "Tipo Evento", path: "/dashboard/events/create-event/tipoEvento" },
  { id: "ubicacion", name: "Ubicación", path: "/dashboard/events/create-event/ubicacion" },
];

const useTabNavigation = (currentSectionId) => {
  const navigate = useNavigate();
  
  // Obtener índice actual con validación
  const currentIndex = sections.findIndex((section) => section.id === currentSectionId);
  
  // Validar que la sección exista
  if (currentIndex === -1) {
    console.error(`Sección no encontrada: ${currentSectionId}`);
    return {
      goToNextSection: () => {},
      goToPreviousSection: () => {},
      showPreviousButton: false,
      showNextButton: false,
      isLastSection: false,
      currentSection: null,
      sections,
      progress: { current: 0, total: 0, percentage: 0 },
      markSectionAsCompleted: () => {},
      isSectionCompleted: () => false
    };
  }

  // Calcular estados
  const isLastSection = currentIndex === sections.length - 1;
  const isFirstSection = currentIndex === 0;

  return {
    goToNextSection: () => {
      if (!isLastSection) {
        navigate(sections[currentIndex + 1].path);
      }
    },
    goToPreviousSection: () => {
      if (!isFirstSection) {
        navigate(sections[currentIndex - 1].path);
      }
    },
    showPreviousButton: !isFirstSection,
    showNextButton: !isLastSection,
    isLastSection,
    currentSection: sections[currentIndex],
    sections,
    progress: {
      current: currentIndex + 1,
      total: sections.length,
      percentage: Math.round(((currentIndex + 1) / sections.length) * 100)
    },
    markSectionAsCompleted: () => {
      const completed = JSON.parse(sessionStorage.getItem('completedSections') || '{}');
      completed[currentSectionId] = true;
      sessionStorage.setItem('completedSections', JSON.stringify(completed));
    },
    isSectionCompleted: (sectionId) => {
      const completed = JSON.parse(sessionStorage.getItem('completedSections') || '{}');
      return !!completed[sectionId];
    }
  };
};

export default useTabNavigation;