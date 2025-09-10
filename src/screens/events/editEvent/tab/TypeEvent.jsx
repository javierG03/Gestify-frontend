import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import useEditTabNavigation from '../../../../hooks/useEditTabNavigation';

import NavigationButtons from '../../NavigationButtons';
import TypeEventForm from '../../forms/TypeEventForm';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../../components/events/ConfirmationModal';

const TypeEvent = () => {
  const {
    goToNextSection,
    goToPreviousSection,
    isLastSection
  } = useEditTabNavigation("editarTipoEvento");

  const { formData, updateFormData } = useOutletContext();

  const initialData = formData?.tipoEvento || {};

  const formatTo24hInput = (isoDateStr) => {
    if (!isoDateStr) return "";
    const date = new Date(isoDateStr);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const normalizeMode = (mode) => {
    if (!mode) return "";
    const clean = mode.toLowerCase().trim();
    if (["virtual", "presencial", "hibrido"].includes(clean)) return clean;
    return "";
  };

  const [localData, setLocalData] = useState({
    tipo_eventType: initialData.id_category || "",
    tipo_description: initialData.event_type_description || "",
    tipo_maxParticipants: initialData.max_participants ?? null,
    tipo_videoLink: initialData.video_conference_link || "",
    tipo_price: initialData.event_price ?? null,
    tipo_startDate: initialData.start_time ? initialData.start_time.slice(0, 10) : "",
    tipo_startTime: initialData.start_time ? formatTo24hInput(initialData.start_time) : "",
    tipo_endDate: initialData.end_time ? initialData.end_time.slice(0, 10) : "",
    tipo_endTime: initialData.end_time ? formatTo24hInput(initialData.end_time) : "",
    tipo_mode: normalizeMode(initialData.event_type) || ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field, value) => {
    setLocalData(prev => ({
      ...prev,
      [field]: value === "" ? null : Number(value)
    }));
  };

  const formatDateToISO = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;

    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);

      const dateUTC = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
      return dateUTC.toISOString();
    } catch (error) {
      console.error("Error generando fecha ISO:", error);
      return null;
    }
  };

  const transformDataForAPI = () => {
    return {
      id_type_of_event: formData.tipoEvento?.id_type_of_event || null,
      event_type: localData.tipo_mode,
      description: localData.tipo_description,
      start_time: formatDateToISO(localData.tipo_startDate, localData.tipo_startTime),
      end_time: formatDateToISO(localData.tipo_endDate, localData.tipo_endTime),
      max_participants: localData.tipo_maxParticipants,
      video_conference_link: localData.tipo_videoLink || "",
      price: localData.tipo_price,
      category_id: localData.tipo_eventType
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!localData.tipo_eventType) newErrors.event_type = "El tipo de evento es obligatorio";
    if (!localData.tipo_mode) newErrors.mode = "La modalidad es obligatoria";
    if (!localData.tipo_description.trim()) newErrors.description = "La descripción es obligatoria";

    if (!localData.tipo_startDate) newErrors.start_date = "La fecha de inicio es requerida";
    if (!localData.tipo_startTime) newErrors.start_time = "La hora de inicio es requerida";
    if (!localData.tipo_endDate) newErrors.end_date = "La fecha de finalización es requerida";
    if (!localData.tipo_endTime) newErrors.end_time = "La hora de finalización es requerida";

    if (["virtual", "hibrido"].includes(localData.tipo_mode)) {
      if (!localData.tipo_videoLink?.trim()) {
        newErrors.video_Conference_Link = "El enlace de videoconferencia es obligatorio";
      } else if (!/^https?:\/\//i.test(localData.tipo_videoLink)) {
        newErrors.video_Conference_Link = "El enlace debe comenzar con http:// o https://";
      }
    }

    if (localData.tipo_startDate && localData.tipo_startTime &&
        localData.tipo_endDate && localData.tipo_endTime) {
      const startDateTime = new Date(`${localData.tipo_startDate}T${localData.tipo_startTime}`);
      const endDateTime = new Date(`${localData.tipo_endDate}T${localData.tipo_endTime}`);
      if (startDateTime >= endDateTime) {
        newErrors.end_time = "La fecha y hora de fin debe ser posterior a la de inicio";
      }
    }

    if (localData.tipo_price === null || isNaN(localData.tipo_price)) {
      newErrors.price = "El precio es obligatorio";
    } else if (localData.tipo_price < 0) {
      newErrors.price = "El precio no puede ser negativo";
    } else if (localData.tipo_price > 9999999) {
      newErrors.price = "El precio no puede exceder $10,000";
    }

    if (localData.tipo_maxParticipants === null || isNaN(localData.tipo_maxParticipants)) {
      newErrors.max_Participants = "El máximo de participantes es obligatorio";
    } else if (localData.tipo_maxParticipants < 1) {
      newErrors.max_Participants = "Debe haber al menos 1 participante";
    } else if (localData.tipo_maxParticipants > 1000) {
      newErrors.max_Participants = "No puede exceder 1000 participantes";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
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
      const updatedTypeEvent = transformDataForAPI();
      updateFormData("tipoEvento", updatedTypeEvent);
      toast.success('Cambios guardados exitosamente!');
    } catch (error) {
      console.error("Error al actualizar el tipo de evento:", error);
      toast.error(error.message || "Ocurrió un error al actualizar el tipo de evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    
    // Actualizar el contexto antes de navegar
    const updatedTypeEvent = transformDataForAPI();
    updateFormData("tipoEvento", updatedTypeEvent);

    if (isLastSection) {
      await handleSubmit();
    } else {
      if (validateForm()) {
        setIsSubmitting(true);
        goToNextSection();
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    validateForm();
  }, [localData]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">Tipo de Evento</h2>
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
        <TypeEventForm
          localData={localData}
          errors={errors}
          handleChange={handleChange}
          handleNumberChange={handleNumberChange}
        />
      </div>
      <NavigationButtons
        isLastSection={isLastSection}
        isSubmitting={isSubmitting}
        isCreatingEvent={false}
        isEditingEvent={true}
        onBack={goToPreviousSection}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isFormValid={isFormValid}
      />
    </div>
  );
};

export default TypeEvent;