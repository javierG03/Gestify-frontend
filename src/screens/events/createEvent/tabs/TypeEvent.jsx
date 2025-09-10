import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import useTabNavigation from '../../../../hooks/useTabNavigation';
import NavigationButtons from '../../NavigationButtons';
import TypeEventForm from "../../forms/TypeEventForm";

const TypeEvent = () => {
  const {
    showNextButton,
    goToNextSection,
    goToPreviousSection
  } = useTabNavigation("tipoEvento");

  const { updateFormData } = useOutletContext();

  const STORAGE_KEY = 'tab_tipoEvento_data';
  const COMPLETION_KEY = 'tab_tipoEvento_completed';

  const [localData, setLocalData] = useState(() => {
    const savedData = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
    return {
      tipo_eventType: savedData.tipo_eventType || "",
      tipo_description: savedData.tipo_description || "",
      tipo_maxParticipants: savedData.tipo_maxParticipants || null,
      tipo_videoLink: savedData.tipo_videoLink || "",
      tipo_price: savedData.tipo_price || null,
      tipo_startDate: savedData.tipo_startDate || "",
      tipo_startTime: savedData.tipo_startTime || "",
      tipo_endDate: savedData.tipo_endDate || "",
      tipo_endTime: savedData.tipo_endTime || "",
      tipo_mode: savedData.tipo_mode || ""
    };
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
    updateFormData('typeEventData', transformDataForContext(localData));
  }, [localData]);

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field, value) => {
    if (/^\d*$/.test(value)) {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue <= 100000) {
        setLocalData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, max_Participants: null }));
      } else if (numericValue > 100) {
        setErrors(prev => ({ ...prev, max_Participants: 'El máximo permitido es 100.000' }));
      } else {
        setLocalData(prev => ({ ...prev, [field]: value }));
      }
    }
  };


  const handleNumberChange2 = (field, value) => {
    if (/^\d*$/.test(value)) {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue <= 100000000) {
        setLocalData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, price: null }));
      } else if (numericValue > 100) {
        setErrors(prev => ({ ...prev, price: 'El máximo permitido es 100.000.000' }));
      } else {
        setLocalData(prev => ({ ...prev, [field]: value }));
      }
    }
  };


  const formatDateToISO = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;

    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [time, period] = timeStr.trim().split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      // Convertir a 24h
      if (period?.toLowerCase() === 'pm' && hours < 12) hours += 12;
      if (period?.toLowerCase() === 'am' && hours === 12) hours = 0;

      // Crear objeto Date en UTC
      const dateUTC = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
      return dateUTC.toISOString(); // ✅ formato "2025-05-02T01:00:00.000Z"
    } catch (error) {
      console.error("Error generando fecha ISO:", error);
      return null;
    }
  };

  const transformDataForContext = (data) => {
    const startTime = data.tipo_startDate && data.tipo_startTime
      ? formatDateToISO(data.tipo_startDate, data.tipo_startTime)
      : null;

    const endTime = data.tipo_endDate && data.tipo_endTime
      ? formatDateToISO(data.tipo_endDate, data.tipo_endTime)
      : null;

    return {
      id_type_of_event: null,
      event_type: data.tipo_mode,
      description: data.tipo_description,
      start_time: startTime,
      end_time: endTime,
      max_Participants: data.tipo_maxParticipants,
      video_Conference_Link: data.tipo_videoLink || "",
      price: data.tipo_price,
      category_id: data.tipo_eventType
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!localData.tipo_eventType.trim()) newErrors.event_type = "El tipo de evento es obligatorio";
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

    // Validación de fechas combinadas
    if (localData.tipo_startDate && localData.tipo_startTime &&
      localData.tipo_endDate && localData.tipo_endTime) {
      const startDateTime = new Date(`${localData.tipo_startDate}T${formatTo24h(localData.tipo_startTime)}`);
      const endDateTime = new Date(`${localData.tipo_endDate}T${formatTo24h(localData.tipo_endTime)}`);
      if (startDateTime >= endDateTime) {
        newErrors.end_time = "La fecha y hora de fin debe ser posterior a la de inicio";
      }
    }

    if (localData.tipo_price === null || isNaN(localData.tipo_price)) {
      newErrors.price = "El precio es obligatorio";
    } else if (localData.tipo_price < 0) {
      newErrors.price = "El precio no puede ser negativo";
    } else if (localData.tipo_price > 999999999) {
      newErrors.price = "El precio no puede exceder $999,000,000";
    }

    if (localData.tipo_maxParticipants === null || isNaN(localData.tipo_maxParticipants)) {
      newErrors.max_Participants = "El máximo de participantes es obligatorio";
    } else if (localData.tipo_maxParticipants < 1) {
      newErrors.max_Participants = "Debe haber al menos 1 participante";
    } else if (localData.tipo_maxParticipants > 100000) {
      newErrors.max_Participants = "El máximo de participantes no puede exceder 100.000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTo24h = (timeStr) => {
    if (!timeStr) return "00:00";
    const [time, period] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period?.toLowerCase() === 'pm' && hours < 12) hours += 12;
    if (period?.toLowerCase() === 'am' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const dataToSend = transformDataForContext(localData);
        console.log('Datos a enviar al backend:', dataToSend);
        sessionStorage.setItem(COMPLETION_KEY, 'true');
        goToNextSection();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
        <TypeEventForm
          localData={localData}
          errors={errors}
          handleChange={handleChange}
          handleNumberChange={handleNumberChange}
          handleNumberChange2={handleNumberChange2}
        />
      </div>
      <NavigationButtons
        isLastSection={false}
        isSubmitting={isSubmitting}
        isCreatingEvent={false}
        onBack={goToPreviousSection}
        onNext={handleNext}
        onSubmit={handleNext} // 👈 puedes reutilizar handleNext o definir otra función
        isFormValid={Object.keys(errors).length === 0} // 👈 true si no hay errores
      />
    </div>
  );
};

export default TypeEvent;