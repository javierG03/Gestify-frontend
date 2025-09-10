import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../../components/ConfirmationModal';
import Swal from 'sweetalert2';
import { AuthContext } from "../../config/AuthProvider";

import {
  FiCalendar,
  FiMapPin,
  FiTablet,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUser,
  FiDollarSign,
  FiPlus,
  FiBox,
  FiShoppingCart
} from 'react-icons/fi';
import BackButton from '../../components/BackButton';
import { RollerCoaster } from 'lucide-react';

const tabs = ['Participantes', 'Recursos', 'Alimentos'];

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [dataTab, setDataTab] = useState({ Participantes: null, Recursos: null, Alimentos: null });
  const [loadingTab, setLoadingTab] = useState(false);
  const [errorTab, setErrorTab] = useState('');
  const [showModal, setShowModal] = useState(false);


  const {role} = useContext(AuthContext)
  
  const userRole = role
  
 

  // Carga detalles generales
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [API_URL, id]);

  // Carga datos de la pestaña activa
  useEffect(() => {
    const fetchTabData = async () => {
      if (dataTab[activeTab] != null) return;
      setLoadingTab(true);
      setErrorTab('');

      let url = '';
      switch (activeTab) {
        case 'Participantes':
          url = `${API_URL}/participants/event/${id}`;
          break;
        case 'Recursos':
          url = `${API_URL}/events/${id}/resources`;
          break;
        case 'Alimentos':
          url = `${API_URL}/events/${id}/food`;
          break;
        default:
          return;
      }

      try {
        const { data } = await axios.get(url);
        setDataTab(prev => ({ ...prev, [activeTab]: data }));
      } catch (err) {
        setErrorTab(err.message);
      } finally {
        setLoadingTab(false);
      }
    };
    fetchTabData();
  }, [activeTab, API_URL, id, dataTab]);

  if (loading) return <p className="text-center py-10">Cargando...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;
  if (!event) return <p className="text-center py-10">Evento no encontrado</p>;

  // Formateo fechas
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const fecha = start.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const horario = `${start.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;

  const confirmDeleteEvent = async () => {
    try {
      await axios.delete(`${API_URL}/events/${id}`);

      Swal.fire({
        title: "Evento eliminado",
        text: "El evento ha sido eliminado correctamente.",
        icon: "success"
      }).then(() => {
        navigate('/dashboard/events');
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setShowModal(false); // Cierra el modal tras intento
    }
  };

  const handleDeleteEvent = async () => {
    setShowModal(true);
  }

  const handleBIlling = () => {
    // Lógica para manejar la facturación
    navigate(`/dashboard/events/billing-event/${id}`);
  }


  // Función para navegar a la edición del evento
  const handleEditEvent = () => {
    navigate(`/dashboard/events/edit-event/editarEvento`, {
      state: { eventId: id }
    });
  }


  return (
    <div className="w-full min-h-screen bg-gray-50 py-5">
      <div className="w-full mb-8">
        <BackButton label="Volver a eventos" />
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-5 rounded-2xl overflow-hidden shadow-lg">
          <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
            {event.image_url && event.image_url.length > 0 ? (
              <img
                src={event.image_url[0]}
                alt={event.event_name}
                className="w-full h-full object-cover object-center"
                style={{ minHeight: 550 }} // Asegura que la imagen tenga un tamaño mínimo
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500" style={{ minHeight: 250 }}>
                Sin imagen
              </div>
            )}
          </div>
        </div>

        {/* Detalles generales */}
        <div className="col-span-12 lg:col-span-7 p-8  flex flex-col justify-between">
          <div>
            <h1 className={`inline-block px-4 py-1 mb-5 rounded-full font-medium ${event.state === 'En curso' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
              {event.state}
            </h1>
            <h1 className="text-4xl font-semibold text-gray-900">{event.event_name}</h1>
            <p className="text-gray-500 mt-2">{event.category_name}</p>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start text-gray-700">
                <FiCalendar size={24} className="text-indigo-500 mr-3" />
                <div>
                  <p className="font-medium">{fecha}</p>
                  <p className="text-sm text-gray-400">{horario}</p>
                </div>
              </li>
              <li className="flex items-start text-gray-700">
                <FiMapPin size={24} className="text-indigo-500 mr-3" />
                <div>
                  <p className="font-medium">{event.location_name}</p>
                  <p className="text-sm text-gray-400">{event.location_address}</p>
                </div>
              </li>
              <li className="flex items-start text-gray-700">
                <FiTablet size={24} className="text-indigo-500 mr-3" />
                <div>
                  <p className="font-medium">Modalidad – {event.event_type}</p>
                  {event.video_conference_link ? (
                    <a
                      href={event.video_conference_link}
                      className="text-sm text-indigo-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >Unirse a la videoconferencia</a>
                  ) : (
                    <p className="text-sm text-gray-400">{event.event_type === 'Virtual' ? 'Enlace no disponible' : 'Presencial'}</p>
                  )}
                </div>
              </li>
              <li className="flex items-start text-gray-700">
                <FiUsers size={24} className="text-indigo-500 mr-3" />
                <div><p className="font-medium">Max. Participantes: {event.max_participants}</p></div>
              </li>
            </ul>
          </div>
            {(userRole === 1 || userRole === 2) && (
              <button
                className="mt-8 self-start px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                onClick={handleEditEvent}
              >
                Editar Ajustes
              </button>
            )}
        </div>

        {/* Descripción y Tabs */}
        <div className="col-span-12 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Descripción</h2>
          <p className="text-gray-600 leading-relaxed mb-8">{event.event_type_description || 'No hay descripción disponible.'}</p>

          {/* Tabs */}
          {(userRole === 1 || userRole === 2) && (
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex justify-center space-x-12" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 border-b-2 font-medium text-lg focus:outline-none ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}>
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          )}


          {/* Contenido de la pestaña */}
          {(userRole === 1 || userRole === 2) ? (
            loadingTab ? (
              <p className="text-center py-10">Cargando {activeTab.toLowerCase()}...</p>
            ) : errorTab ? (
              <p className="text-center py-10 text-red-500">Error: {errorTab}</p>
            ) : (
              <>
                {activeTab === 'Participantes' && dataTab.Participantes && (
                  <>
                    {/* Resumen de estados */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-6">
                      <div className="flex items-center">
                        <FiCheckCircle className="text-indigo-600 mr-2" />
                        <span className="text-gray-700">Confirmados {dataTab.Participantes.filter(u => u.status_name?.toLowerCase() === 'confirmado').length}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="text-indigo-600 mr-2" />
                        <span className="text-gray-700">Pendientes {dataTab.Participantes.filter(u => u.status_name?.toLowerCase() === 'pendiente').length}</span>
                      </div>
                      <div className="flex items-center">
                        <FiUser className="text-gray-500 mr-2" />
                        <span className="text-gray-700">Asistió {dataTab.Participantes.filter(u => u.status_name?.toLowerCase() === 'asistió').length}</span>
                      </div>
                      <div className="flex items-center">
                        <FiXCircle className="text-gray-600 mr-2" />
                        <span className="text-gray-700">Cancelado {dataTab.Participantes.filter(u => u.status_name?.toLowerCase() === 'cancelado').length}</span>
                      </div>
                    </div>

                    {/* Botón de agregar participante */}
                    <div className="flex justify-end max-w-3xl mx-auto mb-4">
                      <button 
                        onClick={() => navigate(`/dashboard/events/invite/${id}`)}
                        className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 focus:outline-none"
                      >
                        <FiPlus size={24} />
                      </button>
                    </div>

                    {/* Listado */}
                    <div className="space-y-4 max-w-3xl mx-auto">
                      {dataTab.Participantes.length === 0 ? (
                        <div className="flex flex-col items-center text-center text-gray-500 space-y-4 py-10">
                          <FiUser size={48} className="text-gray-400" />
                          <p className="text-lg font-semibold">No hay participantes</p>
                          <p className="text-sm">Puedes agregar participantes oprimiendo el botón de arriba.</p>
                        </div>
                      ) : (
                        <>
                          {dataTab.Participantes.slice(0, 3).map(u => (
                            <div key={u.id} className="flex items-start bg-white p-4 rounded-lg shadow">
                              <FiUser size={32} className="text-gray-400 mr-4" />
                              <div className="flex flex-col">
                                <p className="font-semibold text-gray-900">{u.user_name + u.user_last_name}</p>
                                <p className="text-sm text-gray-500 mb-2">{u.email}</p>
                                <div className="flex items-center">
                                  {u.status_name === 'confirmado' && <FiCheckCircle className="text-green-500 mr-1" />}
                                  {u.status_name === 'pendiente' && <FiClock className="text-yellow-500 mr-1" />}
                                  {u.status_name === 'cancelado' && <FiXCircle className="text-red-500 mr-1" />}
                                  <span className="text-sm text-black font-semibold bg-gray-200 rounded-2xl px-3 py-1">
                                    {u.status_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}

                      {/* Link al final */}
                      <button
                        onClick={() => navigate(`/dashboard/events/participants/${id}`)}
                        className="text-indigo-600 hover:underline font-semibold mt-4"
                      >
                        Ver todos los participantes
                      </button>
                    </div>
                  </>
                )}

                {/* Recursos */}
                {activeTab === 'Recursos' && dataTab.Recursos && (
                  <>
                    <div className="flex justify-between items-center mb-4 p-6">
                      <a
                        onClick={() => navigate(`/dashboard/events/detail-events/${id}/resource-list`)}
                        className="text-indigo-600 hover:underline font-semibold">Ver todos los recursos</a>
                      <button
                        onClick={() => navigate(`/dashboard/events/detail-events/${id}/add-resource`)}
                        className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 focus:outline-none">
                        <FiPlus size={24} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-3">
                      {dataTab.Recursos.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center text-center text-gray-500 space-y-4 py-10">
                          <FiBox size={48} className="text-gray-400" />
                          <p className="text-lg font-semibold">No hay recursos</p>
                          <p className="text-sm">Puedes agregar recursos usando el botón de arriba.</p>
                        </div>
                      ) : (
                        dataTab.Recursos.slice(0, 3).map(r => (
                          <div key={r.id} className="bg-white p-4 rounded-lg shadow flex justify-between">
                            <div>
                              <p className="font-semibold text-gray-900 mb-1">{r.name}</p>
                              <p className="text-sm text-gray-500">{r.quantity_available} unidades</p>
                              <p className="text-sm text-gray-500">{r.description}</p>
                              <p className="text-sm text-gray-500">Precio unitario: ${Number(r.price).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <p className="font-semibold text-indigo-600 flex items-center">
                                <FiDollarSign className="mr-1" />
                                {(Number(r.price) * Number(r.quantity_available)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {/* Alimentos */}
                {activeTab === 'Alimentos' && dataTab.Alimentos && (
                  <>
                    <div className="flex justify-between items-center mb-4 p-6">
                      <a
                        onClick={() => navigate(`/dashboard/events/detail-events/${id}/food-list`)}
                        className="text-indigo-600 hover:underline font-semibold">Ver todos los alimentos</a>
                      <button
                        onClick={() => navigate(`/dashboard/events/detail-events/${id}/add-food`)}
                        className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 focus:outline-none">
                        <FiPlus size={24} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dataTab.Alimentos.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center text-center text-gray-500 space-y-4 py-10">
                          <FiShoppingCart size={48} className="text-gray-400" />
                          <p className="text-lg font-semibold">No hay alimentos</p>
                          <p className="text-sm">Puedes agregar alimentos usando el botón de arriba.</p>
                        </div>
                      ) : (
                        dataTab.Alimentos.slice(0, 3).map(f => (
                          <div key={f.id} className="bg-white p-4 rounded-lg shadow flex justify-between">
                            <div>
                              <p className="font-semibold text-gray-900 mb-1">{f.name}</p>
                              <p className="text-sm text-gray-500">{f.quantity_available} unidades</p>
                              <p className="text-sm text-gray-500">{f.description}</p>
                              <p className="text-sm text-gray-500">Precio unitario: ${Number(f.price).toFixed(2)}</p>
                            </div>
                            <p className="font-semibold text-indigo-600 flex items-center">
                              <FiDollarSign className="mr-1" />
                              {(Number(f.price) * Number(f.quantity_available)).toFixed(2)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </>
            )
          ) : (
            <p className="text-center py-10 text-gray-500"></p>
          )}

        </div>
      </div>
      {(userRole === 1 || userRole === 2) && (    
      <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-10 items-center justify-center mt-10">
        <button className='bg-red-500 rounded-xl px-6 py-3 text-xl text-white' onClick={handleDeleteEvent}>Eliminar evento</button>
        <button className='bg-indigo-500 rounded-xl px-6 py-3 text-xl text-white' onClick={handleBIlling}>Facturación</button>
      </div>
       )}
      {(userRole === 4) && (    
      <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-10 items-center justify-center mt-10">
        <button className='bg-indigo-500 rounded-xl px-6 py-3 text-xl text-white' onClick={handleBIlling}>Facturación</button>
      </div>
       )}
      <ConfirmationModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDeleteEvent}
        message="¿Estás seguro de que deseas eliminar este evento?"
      />

    </div>


  );
};

export default EventDetail;