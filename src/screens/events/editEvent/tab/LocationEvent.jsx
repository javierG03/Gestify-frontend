import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import NavigationButtons from '../../NavigationButtons';
import useEditTabNavigation from '../../../../hooks/useEditTabNavigation';
import { useEditEventAPI } from '../../../../hooks/useEditEventApi';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../../components/events/ConfirmationModal';
import LocationForm from '../../forms/LocationForm';
import { dataURLtoFile } from '../../../../utils/imageHelperrs';
import { getFinalImageFile } from '../../../../utils/getFinalImageFile';

const LocationEvent = () => {
  const { goToNextSection, goToPreviousSection, isLastSection } = useEditTabNavigation("editarUbicacion");
  const { formData, updateFormData } = useOutletContext();
  const { updateCompleteEvent } = useEditEventAPI(); // 👈 usa el nuevo hook
  const navigate = useNavigate();

  const initialData = formData?.ubicacion || {};

  const [localData, setLocalData] = useState({
    ubicacion_name: initialData.location_name || "",
    ubicacion_description: initialData.location_description || "",
    ubicacion_price: initialData.location_price ?? null,
    ubicacion_address: initialData.location_address || ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!localData.ubicacion_name.trim()) newErrors.name = "El nombre del lugar es obligatorio";
    if (!localData.ubicacion_address.trim()) newErrors.address = "La dirección es obligatoria";
    if (!localData.ubicacion_description.trim()) newErrors.description = "La descripción es obligatoria";
    if (localData.ubicacion_price === null || isNaN(localData.ubicacion_price)) {
      newErrors.price = "El precio es obligatorio";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field, value) => {
    setLocalData(prev => ({
      ...prev,
      [field]: value === "" ? null : Number(value)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Por favor completa todos los campos requeridos.");
      setIsSubmitting(false);
      return;
    }

    const confirmed = await ConfirmationModal.show({
      title: 'Actualizar Evento',
      text: '¿Estás seguro de que deseas guardar los cambios?',
      confirmButtonText: 'Sí, actualizar evento',
      icon: 'question'
    });

    if (!confirmed) {
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Construir el objeto de ubicación actualizado
      const updatedUbicacion = {
        id: formData?.ubicacion?.id_location,
        name: localData.ubicacion_name,
        description: localData.ubicacion_description,
        price: localData.ubicacion_price,
        address: localData.ubicacion_address
      };

      // 2. Actualizar el contexto local
      updateFormData("ubicacion", updatedUbicacion);

      const eventData = {
        id_event: formData?.id_event,
        name: formData.evento?.event_name,
        event_state_id: formData.evento?.event_state_id
      };

      // Agregar imagen solo si es un File válido
      if (formData.evento?.image instanceof File) {
        eventData.image = formData.evento.image;
      }

      // 4. Preparar tipo de evento
      const updatedTypeEventData = {
        id_type_of_event: formData.tipoEvento?.id_type_of_event || null,
        event_type: formData.tipoEvento?.event_type,
        description: formData.tipoEvento?.event_type_description,
        max_participants: formData.tipoEvento?.max_participants,
        video_conference_link: formData.tipoEvento?.video_conference_link || "",
        price: formData.tipoEvento?.event_price,
        category_id: formData.tipoEvento?.id_category,
        start_time: formData.tipoEvento?.start_time,
        end_time: formData.tipoEvento?.end_time
      };

      // 5. Preparar imagen si es base64
      if (eventData.image && typeof eventData.image === 'string' && eventData.image.startsWith("data:image/")) {
        const imageFile = dataURLtoFile(eventData.image, eventData.imageFileName || "event-image.png");
        if (imageFile) {
          eventData.image = imageFile;
        }
      }

      // 6. Ejecutar actualización y redirigir
      const result = await updateCompleteEvent(
        formData.id_event,
        eventData,
        formData.tipoEvento,
        updatedTypeEventData,
        updatedUbicacion
      );

      // 7. Redirección si todo fue exitoso
      if (result?.success) {
        toast.success('Evento actualizado correctamente');
        navigate(`/dashboard/events/detail-events/${formData.id_event}`);
      }

    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      toast.error(error.message || "Ocurrió un error al actualizar el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();

    updateFormData("ubicacion", {
      ...formData.ubicacion,
      name: localData.ubicacion_name,
      description: localData.ubicacion_description,
      price: localData.ubicacion_price,
      address: localData.ubicacion_address
    });

    if (isLastSection) {
      await handleSubmit();
    } else {
      goToNextSection();
    }
  };

  const handleBack = () => {
    goToPreviousSection();
  };

  useEffect(() => {
    const valid = validateForm();
    setIsFormValid(valid);
  }, [localData]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">Ubicación del Evento</h2>

      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
        <LocationForm
          data={localData}
          errors={errors}
          onChange={handleChange}
          onNumberChange={handleNumberChange}
        />
      </div>

      <NavigationButtons
        isLastSection={isLastSection}
        isSubmitting={isSubmitting}
        isCreatingEvent={false}
        isEditingEvent={true}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isFormValid={isFormValid}
      />
    </div>
  );
};

export default LocationEvent;