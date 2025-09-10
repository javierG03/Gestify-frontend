import { useNavigate } from "react-router-dom";

// Secciones específicas para la edición de eventos
// Ajustamos las rutas para que coincidan con la configuración en AppRouter.jsx
const editSections = [
  { id: "editarEvento", name: "Detalles", path: "/dashboard/events/edit-event/editarEvento" },
  { id: "editarTipoEvento", name: "Logistica", path: "/dashboard/events/edit-event/editarTipoEvento" },
  { id: "editarUbicacion", name: "Ubicación", path: "/dashboard/events/edit-event/editarUbicacion" }
];

const useEditTabNavigation = (currentSectionId) => {
  const navigate = useNavigate();
  
  // Obtener índice actual con validación
  const currentIndex = editSections.findIndex((section) => section.id === currentSectionId);
  
  // Validar que la sección exista
  if (currentIndex === -1) {
    console.log(`Sección de edición no encontrada: ${currentSectionId}`);
    return {
      goToNextSection: () => {},
      goToPreviousSection: () => {},
      showPreviousButton: false,
      showNextButton: false,
      isLastSection: false,
      currentSection: null,
      sections: editSections,
      progress: { current: 0, total: 0, percentage: 0 },
      markSectionAsCompleted: () => {},
      isSectionCompleted: () => false
    };
  }
  
  // Calcular estados
  const isLastSection = currentIndex === editSections.length - 1;
  const isFirstSection = currentIndex === 0;
  
  return {
    goToNextSection: () => {
      if (!isLastSection) {
        const nextSection = editSections[currentIndex + 1];
        console.log(`Navegando a: ${nextSection.path}`);
        navigate(nextSection.path, { 
          state: { 
            eventId: new URLSearchParams(window.location.search).get('id') || 
                    JSON.parse(sessionStorage.getItem('currentEditEvent') || '{}').id 
          }
        });
      }
    },
    goToPreviousSection: () => {
      if (!isFirstSection) {
        const prevSection = editSections[currentIndex - 1];
        console.log(`Navegando a: ${prevSection.path}`);
        navigate(prevSection.path, { 
          state: { 
            eventId: new URLSearchParams(window.location.search).get('id') || 
                    JSON.parse(sessionStorage.getItem('currentEditEvent') || '{}').id 
          }
        });
      }
    },
    showPreviousButton: !isFirstSection,
    showNextButton: !isLastSection,
    isLastSection,
    currentSection: editSections[currentIndex],
    sections: editSections,
    progress: {
      current: currentIndex + 1,
      total: editSections.length,
      percentage: Math.round(((currentIndex + 1) / editSections.length) * 100)
    },
    markSectionAsCompleted: () => {
      const completed = JSON.parse(sessionStorage.getItem('editCompletedSections') || '{}');
      completed[currentSectionId] = true;
      sessionStorage.setItem('editCompletedSections', JSON.stringify(completed));
    },
    isSectionCompleted: (sectionId) => {
      const completed = JSON.parse(sessionStorage.getItem('editCompletedSections') || '{}');
      return !!completed[sectionId];
    }
  };
};

export default useEditTabNavigation;