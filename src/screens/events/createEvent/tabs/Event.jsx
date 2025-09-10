import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../config/AuthProvider';
import useTabNavigation from '../../../../hooks/useTabNavigation';
import EventForm from '../../forms/eventForm';

// Función para convertir base64 a archivo File real (mantenida para referencia)
const dataURLtoFile = (dataurl, filename) => {
  if (!dataurl) return null;
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const Event = () => {
  const { showNextButton, goToNextSection } = useTabNavigation("evento");
  const { userId } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  // Estado para las categorías
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  // Recuperar datos del sessionStorage
  const storedData = JSON.parse(sessionStorage.getItem("eventData")) || {};
  const storedTypeEventData = JSON.parse(sessionStorage.getItem("tab_tipoEvento_data")) || {};

  // Estado inicial del formulario
  const [localData, setLocalData] = useState({
    name: storedData.name || "",
    event_state_id: 1,
    type_of_event_id: storedData.type_of_event_id || "",
    location_id: storedData.location_id || null,
    user_created_by: userId || null,
    image: storedData.image || null, // Guardamos la imagen en base64 directamente
    imagePreview: storedData.imagePreview || "",
    imageFileName: storedData.imageFileName || "", // Agregamos nombre del archivo para referencia
    description: storedTypeEventData.tipo_description || "", // Campo movido de TypeEvent
    eventType: storedTypeEventData.tipo_eventType || "" // Campo movido de TypeEvent
  });

  // Estados para validaciones
  const [formErrors, setFormErrors] = useState({
    name: "",
    image: "",
    description: "", // Nueva validación para descripción
    eventType: ""    // Nueva validación para tipo de evento
  });
  
  // Estado para controlar si el formulario es válido
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Estado para controlar si el formulario ya ha sido enviado
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Cargar categorías al iniciar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Error al cargar las categorías');
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

  // Validar el formulario cuando cambian los datos
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [localData, formSubmitted]);

  // Actualizar user_created_by si cambia el contexto
  useEffect(() => {
    if (userId) {
      setLocalData(prev => ({
        ...prev,
        user_created_by: userId
      }));
    }
  }, [userId]);

  // Guardar datos en sessionStorage para ambos formularios
  useEffect(() => {
    // Guardar datos del formulario de evento
    const eventData = {
      name: localData.name,
      event_state_id: localData.event_state_id,
      type_of_event_id: localData.type_of_event_id,
      location_id: localData.location_id,
      user_created_by: localData.user_created_by,
      image: localData.image,
      imagePreview: localData.imagePreview,
      imageFileName: localData.imageFileName
    };
    sessionStorage.setItem("eventData", JSON.stringify(eventData));

    // Actualizar datos del tipo de evento en su propio storage
    const typeEventData = JSON.parse(sessionStorage.getItem("tab_tipoEvento_data")) || {};
    typeEventData.tipo_description = localData.description;
    typeEventData.tipo_eventType = localData.eventType;
    sessionStorage.setItem("tab_tipoEvento_data", JSON.stringify(typeEventData));
  }, [localData]);

  // Función para validar el formulario completo
  const validateForm = () => {
    const errors = {
      name: "",
      image: "",
      description: "",
      eventType: ""
    };
    
    // Validar nombre - no debe estar vacío
    if (!localData.name.trim()) {
      errors.name = "El nombre del evento es obligatorio";
    }
    
    // Validar imagen - debe existir y tener formato correcto
    if (!localData.image) {
      errors.image = "La imagen del evento es obligatoria";
    } else if (localData.imageFileName) {
      const extension = localData.imageFileName.split('.').pop().toLowerCase();
      if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
        errors.image = "Solo se permiten imágenes en formato JPG o PNG";
      }
    }

    // Validar descripción - movida desde TypeEvent
    if (!localData.description.trim()) {
      errors.description = "La descripción es obligatoria";
    }

    // Validar tipo de evento - movida desde TypeEvent
    if (!localData.eventType) {
      errors.eventType = "El tipo de evento es obligatorio";
    }
    
    // Actualizar errores
    setFormErrors(errors);
    
    // Verificar si el formulario es válido (sin errores)
    const valid = !errors.name && !errors.image && !errors.description && !errors.eventType;
    setIsFormValid(valid);
    
    return valid;
  };

  // Manejo de cambios en campos de texto
  const handleChange = (field, value) => {
    setLocalData(prev => {
      const updatedData = { ...prev, [field]: value };
      return updatedData;
    });
  };

  // Manejo de la imagen subida
  const handleImageUpload = (file) => {
    if (!file) return;
    
    // Validar tipo de archivo permitido
    const fileType = file.type.toLowerCase();
    const isValidType = fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png';
    
    if (!isValidType) {
      if (formSubmitted) {
        setFormErrors(prev => ({
          ...prev,
          image: "Solo se permiten imágenes en formato JPG o PNG"
        }));
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      
      // Actualizamos localData con la imagen en base64 y preview
      setLocalData(prev => {
        const updatedData = {
          ...prev,
          image: base64Data, // Guardamos directamente el base64
          imagePreview: base64Data,
          imageFileName: file.name // Guardamos el nombre del archivo para referencia
        };
        
        return updatedData;
      });
      
      // Limpiamos el error de imagen si existía y si el formulario ya ha sido enviado
      if (formSubmitted && formErrors.image) {
        setFormErrors(prev => ({
          ...prev,
          image: ""
        }));
      }
    };

    reader.readAsDataURL(file);
  };
  
  // Función para eliminar la imagen
  const handleRemoveImage = () => {
    // Limpiamos completamente los datos de imagen
    setLocalData(prev => {
      const updatedData = {
        ...prev,
        image: null,
        imagePreview: "",
        imageFileName: ""
      };
      
      return updatedData;
    });
    
    // Actualizamos el estado de error para la imagen solo si el formulario ya ha sido enviado
    if (formSubmitted) {
      setFormErrors(prev => ({
        ...prev,
        image: "La imagen del evento es obligatoria"
      }));
    }
    
    // Aseguramos que cualquier input file relacionado se limpie
    const fileInput = document.getElementById("dropzone-file");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    // Marcamos el formulario como enviado para activar las validaciones
    setFormSubmitted(true);
    
    // Validamos el formulario explícitamente
    const isValid = validateForm();
    
    // Solo permitir avanzar si el formulario es válido
    if (isValid) {
      goToNextSection();
    }
  };

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