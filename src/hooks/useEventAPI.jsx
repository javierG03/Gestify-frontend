import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useEventAPI = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    // Función genérica para llamadas API con axios
    const fetchApi = async (endpoint, method = 'GET', body = null, headers = {}) => {
        console.groupCollapsed(`[API] ${method} ${endpoint}`);
        console.log('Request payload:', body);
        console.log('Request headers:', headers);

        try {
            // Recuperamos el token (asumiendo que lo guardas en localStorage)
            const token = localStorage.getItem('token');

            const response = await axios({
                url: `${API_URL}${endpoint}`,
                method,
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                    ...headers,
                },
            });

            console.log('Response status:', response.status);
            console.log('Response data:', response.data);

            if (![200, 201].includes(response.status)) {
                throw new Error(response.data.message || 'Error en la solicitud');
            }

            return response.data;
        } catch (error) {
            console.error('API Request Failed:', error);
            // Log más detallado del error del servidor
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);

                // También loggeamos el error como string para ver todo el contenido
                console.error('Full error response:', JSON.stringify(error.response.data, null, 2));
            }
            throw error;
        } finally {
            console.groupEnd();
        }
    };

    // Para el tipo de evento
    const createTypeEvent = async (typeEventData) => {
        if (!typeEventData) {
            console.log('[Event Type] No data provided, skipping creation');
            return null;
        }

        console.group('[Event Type] Creating event type');
        try {
            setIsCreating(true);

            // Log de los datos antes de la transformación
            console.log('[Event Type] Raw data:', typeEventData);

            // Validación de campos requeridos
            if (!typeEventData.event_type) {
                throw new Error('event_type is required');
            }

            // Preparar datos - solo incluir campos que tienen valor
            const transformedData = {};

            // Campos básicos requeridos
            transformedData.event_type = typeEventData.event_type;

            // Campos opcionales - solo agregar si tienen valor
            if (typeEventData.description) {
                transformedData.description = typeEventData.description;
            }

            // CORRECCIÓN: Convertir max_participants a número
            if (typeEventData.max_participants || typeEventData.max_Participants) {
                const maxParticipants = typeEventData.max_participants || typeEventData.max_Participants;
                transformedData.max_participants = parseInt(maxParticipants, 10);

                // Validar que sea un número válido
                if (isNaN(transformedData.max_participants)) {
                    throw new Error('max_participants must be a valid number');
                }
            }

            // Para eventos virtuales
            if (typeEventData.event_type === 'virtual' || typeEventData.event_type === 'en_linea') {
                const videoLink = typeEventData.video_conference_link ||
                    typeEventData.video_Conference_Link ||
                    typeEventData.video_Conference_link;
                if (videoLink && videoLink.trim()) {
                    transformedData.video_conference_link = videoLink.trim();
                }
            }

            // CORRECCIÓN: Convertir price a número
            if (typeEventData.price) {
                const price = parseFloat(typeEventData.price);
                if (!isNaN(price)) {
                    transformedData.price = price;
                }
            }

            // CORRECCIÓN: Validar formato de fechas
            if (typeEventData.start_time) {
                const startTime = new Date(typeEventData.start_time);
                if (isNaN(startTime.getTime())) {
                    throw new Error('start_time must be a valid date');
                }
                transformedData.start_time = typeEventData.start_time;
            }

            if (typeEventData.end_time) {
                const endTime = new Date(typeEventData.end_time);
                if (isNaN(endTime.getTime())) {
                    throw new Error('end_time must be a valid date');
                }
                transformedData.end_time = typeEventData.end_time;
            }

            // CORRECCIÓN: Convertir category_id a número
            if (typeEventData.category_id) {
                const categoryId = parseInt(typeEventData.category_id, 10);
                if (!isNaN(categoryId)) {
                    transformedData.category_id = categoryId;
                }
            }

            // Log de los datos transformados
            console.log('[Event Type] Transformed data:', transformedData);
            console.log('[Event Type] Data types:', Object.keys(transformedData).reduce((acc, key) => {
                acc[key] = typeof transformedData[key];
                return acc;
            }, {}));

            // Realizamos la solicitud con fetchApi
            const response = await fetchApi('/types-of-event', 'POST', transformedData);

            console.log('Created event type with ID:', response.id_type_of_event || response.id);
            return response.id_type_of_event || response.id;

        } catch (error) {
            console.error('Error creating event type:', error);

            // MEJOR MANEJO DE ERRORES - Mostrar detalles del error del servidor
            let errorMessage = 'Error al crear el tipo de evento';
            if (error.response?.data) {
                console.error('[Event Type] Server response:', error.response.data);

                // Si el servidor devuelve un mensaje específico
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data.errors) {
                    // Para errores de validación múltiples
                    const errors = Object.values(error.response.data.errors).flat();
                    errorMessage = errors.join(', ');
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
            throw error;
        } finally {
            setIsCreating(false);
            console.groupEnd();
        }
    };

    // Para la ubicación
    const createLocation = async (locationData) => {
        if (!locationData) {
            console.log('[Location] No data provided, skipping creation');
            return null;
        }

        console.group('[Location] Creating location');
        try {
            setIsCreating(true);

            console.log('[Location] Raw data:', locationData);

            // Validación de campos requeridos
            if (!locationData.name) {
                throw new Error('Location name is required');
            }

            const transformedData = {
                name: locationData.name,
                description: locationData.description || '',
                price: locationData.price || 0,
                address: locationData.address || ''
            };

            console.log('[Location] Transformed data:', transformedData);

            const response = await fetchApi('/locations', 'POST', transformedData);

            console.log('Created location with ID:', response.id_location || response.id);
            return response.id_location || response.id;

        } catch (error) {
            console.error('Error creating location:', error);

            let errorMessage = 'Error al crear la ubicación';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
            throw error;
        } finally {
            setIsCreating(false);
            console.groupEnd();
        }
    };

    // Crear evento principal - con los IDs de tipo de evento y ubicación
    const createMainEvent = async (eventData, typeEventId, locationId) => {
        console.group('[Main Event] Creating main event');
        try {
            setIsCreating(true);

            console.log('[Main Event] Raw event data:', eventData);
            console.log('[Main Event] Type event ID:', typeEventId);
            console.log('[Main Event] Location ID:', locationId);

            // Validación de campos requeridos
            if (!eventData.name) {
                throw new Error('Event name is required');
            }

            const formData = new FormData();
            formData.append('name', eventData.name);
            formData.append('event_state_id', eventData.event_state_id || 1);
            formData.append('user_id_created_by', eventData.user_created_by || eventData.user_id_created_by);

            // Agregar tipo de evento y ubicación solo si existen
            if (typeEventId) {
                formData.append('type_of_event_id', typeEventId);
                console.log('[Main Event] Event type ID added to FormData:', typeEventId);
            }

            if (locationId) {
                formData.append('location_id', locationId);
                console.log('[Main Event] Location ID added to FormData:', locationId);
            }

            // Verificar si hay imagen y es un File válido
            if (eventData.image instanceof File) {
                formData.append('image', eventData.image);
                console.log('[Main Event] Image attached:', eventData.image.name);
            } else if (eventData.imagePreview) {
                console.warn('[Main Event] Image is not a File object, only preview exists');
            }

            // Log del contenido de FormData
            console.log('[Main Event] FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
            }

            // Usar fetchApi pero modificar headers para FormData
            const token = localStorage.getItem('token');

            const response = await axios.post(`${API_URL}/events`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                credentials: 'include'
            });

            console.log('Event creation response:', response.data);

            if (response.status !== 200 && response.status !== 201) {
                console.error('Event creation failed:', response.data.message);
                throw new Error(response.data.message || 'Error al crear el evento');
            }

            return response.data;

        } catch (error) {
            console.error('Error creating main event:', error);

            let errorMessage = 'Error al crear el evento principal';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
            throw error;
        } finally {
            setIsCreating(false);
            console.groupEnd();
        }
    };

    // Función completa para crear el evento
    const createCompleteEvent = async (eventData, typeEventData, locationData) => {
        console.group('[Complete Event Flow] Creating event...');
        try {
            setIsCreating(true);

            console.log('Starting complete event creation...');
            console.log('Initial event data:', eventData);
            console.log('Location data:', locationData);
            console.log('Event type data:', typeEventData);

            let typeEventId = null;
            let locationId = null;

            // Crear el tipo de evento si hay datos
            if (typeEventData && typeEventData.event_type) {
                typeEventId = await createTypeEvent(typeEventData);
                console.log('Type event ID obtained:', typeEventId);
            }

            // Crear la ubicación solo si es evento presencial y hay datos de ubicación
            if (locationData && locationData.name &&
                typeEventData?.event_type === 'presencial') {
                locationId = await createLocation(locationData);
                console.log('Location ID obtained:', locationId);
            }

            // Validar que al menos tengamos un type_of_event_id
            if (!typeEventId) {
                throw new Error('No se pudo crear el tipo de evento - es requerido');
            }

            // Crear el evento principal
            const event = await createMainEvent(eventData, typeEventId, locationId);

            console.log('Event successfully created:', event);

            // Mostrar notificación de éxito
            toast.success('Evento creado exitosamente!');

            // Limpiar los datos almacenados en sessionStorage
            sessionStorage.removeItem('eventData');
            sessionStorage.removeItem('tab_tipoEvento_data');
            sessionStorage.removeItem('tab_ubicacion_data');

            // Redirigir al listado de eventos después de un breve retraso
            setTimeout(() => {
                navigate('/dashboard/events');
            }, 1500);

            return event;

        } catch (error) {
            console.error('Complete event creation failed:', error);

            let errorMessage = 'Ocurrió un error al crear el evento';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
            throw error;
        } finally {
            setIsCreating(false);
            console.groupEnd();
        }
    };

    return {
        isCreating,
        createTypeEvent,
        createLocation,
        createMainEvent,
        createCompleteEvent,
        fetchApi
    };
};