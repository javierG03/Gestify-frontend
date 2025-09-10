import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserX, UserRoundCheck } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import LinkClientModal from './LinkClientModal';
import Swal from 'sweetalert2';
import BackButton from '../../components/BackButton';

const EventBilling = () => {
  const { id } = useParams();
  const [billingId, setBillingId] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Estados separados para errores de factura y de cliente
  const [billing, setBilling] = useState(null);
  const [billingError, setBillingError] = useState(null);
  const [clientError, setClientError] = useState(null);

  const [hasEmail, setHasEmail] = useState(false);
  const [customerData, setCustomerData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLinkClientModal, setShowLinkClientModal] = useState(false);

  // Obtener datos de la factura
  const handleGetBilling = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/events/prices/${id}`);
      setBilling(data);
    } catch (err) {
      console.error('Error fetching billing data:', err);
      setBillingError(err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener info adicional de facturación (cliente/email)
  const handleGetBillingInfo = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/billing/${id}`);
      const billing = data.billings?.[0];

      if (billing?.user_email) {
        setHasEmail(true);
        setCustomerData(billing);

        // Guardamos aquí el id_billing en estado
        setBillingId(billing.id_billing);
      } else {
        // Hay billings, pero sin user_email
        setHasEmail(false);
        setCustomerData(null);
        setBillingId(null);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // No hay cliente vinculado: tratamos como "sin cliente"
        setHasEmail(false);
        setCustomerData(null);
        setBillingId(null);
      } else {
        console.error('Error fetching billing info:', err);
        setClientError(err);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    handleGetBilling();
    handleGetBillingInfo();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (billingError) return <p>Error al cargar factura: {billingError.message}</p>;
  if (!billing) return <p>No hay datos de la factura</p>;

  // Convertir fechas y horas
  const start = new Date(billing.start_time);
  const end = new Date(billing.end_time);
  const fechaInicio = start.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const horarioInicio = start.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  const fechaFin = end.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const horarioFin = end.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  // Confirmación para eliminar cliente
  const confirmDeleteEvent = async () => {
    if (!billingId) {
      console.warn('No hay billingId para eliminar');
      return;
    }
    try {
      await axios.delete(`${API_URL}/billing/${billingId}`);
      Swal.fire({
        title: "Cliente eliminado",
        text: "El cliente ha sido eliminado correctamente.",
        icon: "success"
      }).then(() => {
        navigate(`/dashboard/events`);
      });
    } catch (err) {
      console.error('Error eliminando billing:', err);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center gap-10">
      <div className="w-full">
        <BackButton label="Volver a detalles" />
      </div>
      <div className="bg-white w-[90%] sm:w-[75%] md:w-[45%] px-10 py-5 rounded-2xl shadow-lg">
        <h1 className="text-center font-bold text-xl mb-10">INFORMACIÓN DEL EVENTO</h1>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Evento</span>
            <span>{billing.event_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Dirección</span>
            <span>{billing.location_address}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Modalidad</span>
            <span>{billing.event_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Max. Participantes</span>
            <span>{billing.max_participants}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <span className="font-semibold">Inicio</span>
            <span>{fechaInicio} {horarioInicio}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between mb-10">
            <span className="font-semibold">Finalización</span>
            <span>{fechaFin} {horarioFin}</span>
          </div>
        </div>

        <h1 className="text-center font-bold text-xl mb-10">COSTOS</h1>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Logística</span>
            <span>$ {billing.logistics_price}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Alquiler sitio</span>
            <span>$ {billing.location_rent}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Alimentación</span>
            <span>$ {billing.food_total}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Recursos</span>
            <span>$ {billing.resources_total}</span>
          </div>
          <div className="flex justify-between mt-10 text-xl">
            <span className="font-bold">TOTAL</span>
            <span>$ {billing.total_value}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-10">
          {/* Icono según si hay cliente */}
          {hasEmail ? <UserRoundCheck size={64} /> :
          <div className="flex flex-col items-center">
            <UserX size={64} />
            <p>No hay cliente enlazado al evento</p>
          </div>}

          {/* Datos del cliente sólo si existe */}
          {hasEmail && customerData && (
            <div className="mt-5 w-full flex flex-col items-center">
              <p className="text-center font-bold text-lg">Cliente asociado</p>
              <p className="w-full text-center">
                {customerData.user_name} {customerData.user_last_name} – {customerData.user_email}
              </p>
              <div className="mt-5 w-full space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold">Estado:</span>
                  <span>{customerData.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Fecha creación:</span>
                  <span>{new Date(customerData.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            {hasEmail ? (
              <button
                className="bg-red-600 px-4 py-2 rounded-xl text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
                disabled={customerData && customerData.state === 'Pagado'}
                onClick={() => setShowModal(true)}
              >
                Eliminar cliente
              </button>
            ) : (
              <button
                className="bg-indigo-600 px-4 py-2 rounded-xl text-white font-semibold hover:bg-indigo-700 transition"
                onClick={() => setShowLinkClientModal(true)}
              >
                Enlazar cliente
              </button>
            )}
            <button
              className="flex-1 bg-indigo-600 px-10 py-2 rounded-xl text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              disabled={!hasEmail || (customerData && customerData.state === 'Pagado')}
              onClick={() =>
                navigate(
                  `/dashboard/events/billing-event/${id}/payment-view`,
                  { state: { billingId } }
                )
              }
            >
              Pagar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar cliente o pagar */}
      <ConfirmationModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDeleteEvent}
        message="¿Estás seguro de que deseas eliminar este cliente?"
      />

      {/* Modal para enlazar cliente */}
      <LinkClientModal
        showModal={showLinkClientModal}
        onClose={() => setShowLinkClientModal(false)}
        onSuccess={() => {
          setShowLinkClientModal(false);
          handleGetBillingInfo();
        }}
        API_URL={API_URL}
      />
    </div>
  );
};

export default EventBilling;
