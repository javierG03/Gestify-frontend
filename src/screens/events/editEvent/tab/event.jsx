import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import EventForm from "../../forms/eventForm";
import useEditTabNavigation from "../../../../hooks/useEditTabNavigation";

const Event = () => {
  const {
    formData,
    updateFormData,
    markSectionCompleted,
    goToNextSection
  } = useOutletContext();

  const { showNextButton } = useEditTabNavigation("editarEvento");

  const initialEvento = formData?.evento || {};
  const initialTipoEvento = formData?.tipoEvento || {};

  const [localData, setLocalData] = useState({
    name: initialEvento.event_name || "",
    image: undefined,
    imagePreview: initialEvento.imagePreview || initialEvento.image_url || "",
    imageFileName: initialEvento.imageFileName || "",
    description: initialTipoEvento.event_type_description || "",
    eventType: initialTipoEvento.id_category || ""
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    image: "",
    description: "",
    eventType: ""
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateForm = () => {
    const errors = {
      name: "",
      image: "",
      description: "",
      eventType: ""
    };

    if (!localData.name.trim()) {
      errors.name = "El nombre del evento es obligatorio";
    }

    if (!localData.image && !localData.imagePreview) {
      errors.image = "La imagen del evento es obligatoria";
    } else if (localData.imageFileName) {
      const ext = localData.imageFileName.split(".").pop().toLowerCase();
      if (!["jpg", "jpeg", "png"].includes(ext)) {
        errors.image = "Solo se permiten imágenes en formato JPG o PNG";
      }
    }

    if (!localData.description.trim()) {
      errors.description = "La descripción es obligatoria";
    }

    if (!localData.eventType) {
      errors.eventType = "La categoría es obligatoria";
    }

    setFormErrors(errors);
    return Object.values(errors).every((e) => !e);
  };

  const handleChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalData((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result,
        imageFileName: file.name
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setLocalData((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
      imageFileName: ""
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!validateForm()) return;

    // Guardar en formData.evento
    updateFormData("evento", {
      ...formData.evento,
      event_name: localData.name,
      event_state_id: formData.evento?.event_state_id || 1,
      image: localData.image instanceof File ? localData.image : undefined,
      imagePreview: localData.imagePreview,
      imageFileName: localData.imageFileName
    });

    // Guardar en formData.tipoEvento
    updateFormData("tipoEvento", {
      ...formData.tipoEvento,
      event_type_description: localData.description,
      id_category: localData.eventType
    });

    markSectionCompleted("editarEvento");
    goToNextSection();
  };

  // Cargar categorías desde el backend
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error("Error al cargar las categorías");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setErrorCategories(error.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [API_URL]);

  return (
    <EventForm
      localData={localData}
      formErrors={formErrors}
      formSubmitted={formSubmitted}
      categories={categories}
      loadingCategories={loadingCategories}
      errorCategories={errorCategories}
      showNextButton={showNextButton}
      handleChange={handleChange}
      handleImageUpload={handleImageUpload}
      handleRemoveImage={handleRemoveImage}
      handleNext={handleNext}
    />
  );
};

export default Event;
