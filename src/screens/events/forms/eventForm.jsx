import { HiArrowRight } from "react-icons/hi";
import Label from '../../../components/events/LabelForm';
import Input from '../../../components/events/InputForm';
import Dropzone from '../../../components/events/Dropzone';

const EventForm = ({
  localData,
  formErrors,
  formSubmitted,
  categories,
  loadingCategories,
  errorCategories,
  showNextButton,
  handleChange,
  handleImageUpload,
  handleRemoveImage,
  handleNext
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda con el formulario */}
          <div className="flex flex-col space-y-6">
            {/* Nombre del evento */}
            <div className="flex flex-col">
              <Label htmlFor="name">Nombre del Evento *</Label>
              <div className="w-full">
                <Input
                  type="text"
                  id="name"
                  value={localData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full ${formSubmitted && formErrors.name ? 'border-red-500' : ''}`}
                />
                {formSubmitted && formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
            </div>
            
            {/* Tipo de Evento */}
            <div className="flex flex-col">
              <Label htmlFor="eventType">Categoría *</Label>
              <div className="w-full">
                {loadingCategories ? (
                  <div className="w-full h-11 bg-gray-100 animate-pulse rounded-lg" />
                ) : errorCategories ? (
                  <p className="text-red-500 text-sm">{errorCategories}</p>
                ) : (
                  <select
                    id="eventType"
                    value={localData.eventType}
                    onChange={(e) => handleChange("eventType", e.target.value)}
                    className={`w-full h-11 border px-4 py-2.5 text-sm rounded-lg ${
                      formSubmitted && formErrors.eventType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione la categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id_category} value={cat.id_category}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
                {formSubmitted && formErrors.eventType && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.eventType}</p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="flex flex-col">
              <Label htmlFor="description">Descripción *</Label>
              <div className="w-full">
                <textarea
                  id="description"
                  value={localData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className={`w-full border px-4 py-2.5 text-sm rounded-lg ${
                    formSubmitted && formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formSubmitted && formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha con la imagen */}
          <div className="flex flex-col items-center md:items-start">
            <Label htmlFor="image">Imagen del Evento (JPG o PNG) *</Label>
            <Dropzone
              onFileSelect={handleImageUpload}
              imagePreview={localData.imagePreview}
              onImageRemove={handleRemoveImage}
              accept="image/jpeg,image/jpg,image/png"
            />
            {formSubmitted && formErrors.image ? (
              <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
            ) : localData.image && (
              <p className="text-green-600 mt-2">
                ✓ Archivo guardado: {localData.imageFileName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Botón siguiente */}
      <div className="w-full max-w-4xl flex justify-end mt-6">
        {showNextButton && (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            Siguiente
            <HiArrowRight className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EventForm;