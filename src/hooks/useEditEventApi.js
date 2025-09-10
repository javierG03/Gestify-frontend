import axios from "axios";
import { toast } from "react-toastify";

export const useEditEventAPI = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchApi = async (endpoint, method = 'GET', body = null, headers = {}) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    };

    if (body) {
      options.data = body;
      console.groupCollapsed(`[API Request] ${method} ${endpoint}`);
      console.log("Payload:", body);
      console.log("Headers:", options.headers);
      console.groupEnd();
    }

    try {
      const response = await axios(`${API_URL}${endpoint}`, options);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data.message || 'Error en la solicitud');
      }

      return response.data;
    } catch (error) {
      console.error('[API Error]', error);
      throw error;
    }
  };

  const updateTypeEvent = async (typeEventId, updated) => {
    console.log("[Update Type Event] ID:", typeEventId);
    console.group("[Update Type Event]");
    console.log("Endpoint: /types-of-event/" + typeEventId);
    console.log("Payload:", updated);
    console.groupEnd();

    return fetchApi(`/types-of-event/${typeEventId}`, 'PUT', updated);
  };

  const updateLocation = async (locationId, locationData) => {
    const data = {
      name: locationData.name,
      description: locationData.description,
      price: locationData.price,
      address: locationData.address
    };

    console.group("[Update Location]");
    console.log("Endpoint: /locations/" + locationId);
    console.log("Payload:", data);
    console.groupEnd();

    return fetchApi(`/locations/${locationId}`, 'PUT', data);
  };

  const updateMainEvent = async (eventId, eventData, typeEventId, locationId) => {
    const formData = new FormData();

    formData.append('name', eventData.name);

    if (eventData.event_state_id !== undefined && eventData.event_state_id !== null) {
      formData.append('event_state_id', eventData.event_state_id);
    } else {
      console.warn('[Update Main Event] event_state_id no definido, no se incluye en FormData');
    }

    if (typeEventId) {
      formData.append('type_of_event_id', typeEventId);
    }

    if (locationId) {
      formData.append('location_id', locationId);
    }

    console.log("🔍 Analizando eventData.image antes de agregar a FormData...");
    console.log("Tipo de image:", typeof eventData.image);
    console.log("Es instancia de File:", eventData.image instanceof File);
    console.log("Contenido de image:", eventData.image);

    if (eventData.image instanceof File) {
      formData.append('image', eventData.image);
      console.log('[Update Main Event] Imagen modificada incluida:', eventData.image.name);
    } else if (eventData.image === null || eventData.image === undefined) {
      console.log('[Update Main Event] Imagen no incluida porque es null/undefined');
    } else {
      console.warn('[Update Main Event] ⚠️ Imagen presente pero NO es File. No se incluye.');
    }

    console.group("[Update Main Event] FormData ENVIADO");
    console.log("Endpoint:", `${API_URL}/events/${eventId}`);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
    }
    console.groupEnd();

    const response = await axios.put(`${API_URL}/events/${eventId}`, formData, {
      credentials: 'include',
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data.message || 'Error al actualizar el evento');
    }

    return response.data;
  };

  const updateCompleteEvent = async (
    eventId,
    eventData,
    originalTypeEventData,
    updatedTypeEventData,
    locationData
  ) => {
    try {
      console.group("[updateCompleteEvent]");
      console.log("🧾 Datos recibidos para actualizar el evento:");
      console.log("eventId:", eventId);
      console.log("eventData:", eventData);
      console.log("image:", eventData.image);
      console.log("originalTypeEventData:", originalTypeEventData);
      console.log("updatedTypeEventData:", updatedTypeEventData);
      console.log("locationData:", locationData);
      console.groupEnd();

      let typeEventId = null;
      let locationId = null;

      if (updatedTypeEventData && originalTypeEventData?.id_type_of_event) {
        typeEventId = originalTypeEventData.id_type_of_event;
        await updateTypeEvent(typeEventId, updatedTypeEventData);
      }

      if (locationData?.id) {
        await updateLocation(locationData.id, locationData);
        locationId = locationData.id;
      }

      await updateMainEvent(eventId, eventData, typeEventId, locationId);

      return {
        success: true,
        eventId
      };

    } catch (error) {
      console.error("Error actualizando el evento:", error);
      toast.error(error.message || "Ocurrió un error al actualizar el evento");
      return {
        success: false
      };
    }
  };

  const getEventById = async (eventId) => {
    try {
      console.log("[Get Event By ID]:", eventId);
      const response = await fetchApi(`/events/${eventId}`);

      // Función helper para procesar fechas
      const processDateTime = (dateTimeString) => {
        if (!dateTimeString) return { date: '', time: '' };

        const dateTime = new Date(dateTimeString);
        const date = dateTime.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = dateTime.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

        return { date, time };
      };

      const startDateTime = processDateTime(response.start_time);
      const endDateTime = processDateTime(response.end_time);

      // Mapear datos del backend al formato esperado por el frontend
      const processedData = {
        ...response,

        // Mapeo para LocationForm - convertir a números
        ubicacion_name: response.location_name || '',
        ubicacion_description: response.location_description || '',
        ubicacion_address: response.location_address || '',
        ubicacion_price: parseFloat(response.location_price) || 0,

        // Mapeo para TypeEventForm
        tipo_mode: response.event_type || '',
        tipo_videoLink: response.video_conference_link || '',
        tipo_startDate: startDateTime.date,
        tipo_startTime: startDateTime.time,
        tipo_endDate: endDateTime.date,
        tipo_endTime: endDateTime.time,
        tipo_maxParticipants: parseInt(response.max_participants) || 0,
        tipo_price: parseFloat(response.event_price) || 0,

        // Campos numéricos procesados
        max_participants: parseInt(response.max_participants) || 0,
        event_price: parseFloat(response.event_price) || 0,
        location_price: parseFloat(response.location_price) || 0,
        logistics_price: parseFloat(response.logistics_price) || 0,
      };

      console.log("📊 Datos procesados para formularios:", {
        // LocationForm
        ubicacion_name: processedData.ubicacion_name,
        ubicacion_price: processedData.ubicacion_price,
        ubicacion_price_type: typeof processedData.ubicacion_price,

        // TypeEventForm
        tipo_mode: processedData.tipo_mode,
        tipo_startDate: processedData.tipo_startDate,
        tipo_startTime: processedData.tipo_startTime,
        tipo_maxParticipants: processedData.tipo_maxParticipants,
        tipo_maxParticipants_type: typeof processedData.tipo_maxParticipants,
        tipo_price: processedData.tipo_price,
        tipo_price_type: typeof processedData.tipo_price,
      });

      // Agregar temporalmente en tu getEventById para debug
      console.log("🔍 Estructura completa de response:", response);
      console.log("🔍 Campos disponibles:", Object.keys(response));

      return processedData;
    } catch (error) {
      toast.error('No se pudo cargar el evento');
      throw error;
    }
  };

  return {
    updateTypeEvent,
    updateLocation,
    updateMainEvent,
    updateCompleteEvent,
    getEventById
  };
};