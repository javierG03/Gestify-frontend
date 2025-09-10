import PropTypes from 'prop-types';
import { HiArrowRight, HiArrowLeft, HiSave } from "react-icons/hi";

const NavigationButtons = ({
  isLastSection,
  isSubmitting,
  isCreatingEvent,
  isEditingEvent = false, // valor por defecto aquí
  onBack,
  onNext,
  onSubmit = () => {}, // evita crash si no se pasa
  isFormValid = true   // evita crash si no se pasa
}) => {

  const handleSubmit = async () => {
    // Solo llamamos a onSubmit, ya que la lógica de confirmación del modal está en LocationEvent
    await onSubmit();
  };

  return (
    <div className="w-full max-w-4xl flex justify-between mt-6">
      {/* Botón Retroceder - Siempre visible */}
      <button
        onClick={onBack}
        disabled={isSubmitting || isCreatingEvent}
        className="px-6 py-2.5 bg-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors font-medium disabled:bg-gray-400"
      >
        <HiArrowLeft className="size-5" />
        <span>Retroceder</span>
      </button>

      <div className="flex gap-4">
        {/* Botón Siguiente - Solo visible si no es la última sección */}
        {!isLastSection && (
          <button
            onClick={onNext}
            disabled={isSubmitting || isCreatingEvent}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium disabled:opacity-70"
          >
            <span>Siguiente</span>
            <HiArrowRight className="size-5" />
          </button>
        )}

        {/* Botón Crear/Editar Evento - Solo visible en última sección */}
        {isLastSection && (
          <button
            onClick={handleSubmit} // Aquí manejamos la creación
            disabled={isSubmitting || isCreatingEvent || !isFormValid} // Deshabilitar si el formulario no es válido
            className={`px-6 py-2.5 text-white rounded-lg flex items-center gap-2 transition-colors font-medium ${
              isEditingEvent ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-70`}
          >
            <span>{isEditingEvent ? 'Guardar Cambios' : 'Crear Evento'}</span>
            <HiSave className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
};

NavigationButtons.propTypes = {
  isLastSection: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isCreatingEvent: PropTypes.bool.isRequired,
  isEditingEvent: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  isFormValid: PropTypes.bool
};

export default NavigationButtons;