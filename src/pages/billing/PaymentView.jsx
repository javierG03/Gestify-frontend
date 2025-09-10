import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import { set } from 'date-fns';
import Modal from '../../components/Modal';

const PaymentView = () => {
  const { id } = useParams();            // este es tu billingId
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const { billingId } = location.state || {};

  // — estados de facturación —
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // — estados de formulario —
  const [method, setMethod] = useState('paypal');
  const [formattedCard, setFormattedCard] = useState('');  // display
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [nequiNumber, setNequiNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  // 1) Carga la factura
  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/billing/${id}`);
        setBilling(data.billings?.[0]);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!billing) return <p>Factura no encontrada</p>;

  const handleCardNumberChange = e => {
    const nums = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(nums);
    setFormattedCard((nums.match(/.{1,4}/g) || []).join(' '));
  };
  const handleExpiryChange = e => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
    setCardExpiry(val);
  };
  const handleNumericChange = (setter, length) => e => {
    setter(e.target.value.replace(/\D/g, '').slice(0, length));
  };

  const validate = () => {
  const errs = {};
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; 
  const currentMonth = currentDate.getMonth() + 1; 

  if (method === 'card') {
    if (!/^[0-9]{13,16}$/.test(cardNumber)) {
      errs.cardNumber = 'El número de tarjeta debe tener entre 13 y 16 dígitos.';
    }
    
    const match = cardExpiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      errs.cardExpiry = 'Formato inválido. Usa MM/YY.';
    } else {
      const month = parseInt(match[1], 10);
      const year = parseInt(match[2], 10); 
      
      if (month < 1 || month > 12) {
        errs.cardExpiry = 'Mes inválido.';
      } 
      else if (year < 25) {
        errs.cardExpiry = 'La fecha no puede ser inferior al 2025.';
      }
      else if (year === 25 && month < currentMonth) {
        errs.cardExpiry = `La fecha de expiración ya ha pasado.`;
      }
    }
    
    // CVV solo números, mínimo 3 dígitos
    if (!/^[0-9]{3,4}$/.test(cardCvv)) {
      errs.cardCvv = 'El CVV debe tener al menos 3 dígitos.';
    }
  }

  if (method === 'paypal') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paypalEmail)) {
      errs.paypalEmail = 'Introduce un email válido.';
    }
  }

  if (method === 'nequi') {
    if (!/^[0-9]{10}$/.test(nequiNumber)) {
      errs.nequiNumber = 'El número de Nequi debe tener 10 dígitos.';
    }
  }

  setErrors(errs);
  return Object.keys(errs).length === 0;
};

  // 3) Lógica de envío
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      // PATCH al endpoint de billing
      await axios.put(
        `${API_URL}/billing/pay/${billingId}`,
        {
          payment_method: method,
          state: 'paid'
        }
      );
      setShowModal(true);
    } catch (err) {
      console.error('Error actualizando billing:', err);
      alert('No se pudo completar el pago.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full mb-5">
        <BackButton label="Volver a factura" />
      </div>
      <div className="max-w-12xl mx-auto bg-white rounded-2xl shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Datos personales</h2>
            <p className="text-base"><span className="font-medium pr-5">Nombre:</span>{billing.user_name} {billing.user_last_name}</p>
            <p className="text-base mt-2 break-all"><span className="font-medium pr-5 ">Correo:</span>{billing.user_email}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Métodos de pago</h2>
            <div className="space-y-4">
              <label className="flex items-center border-b pb-2">
                <input
                  type="radio"
                  name="method"
                  value="card"
                  checked={method === 'card'}
                  onChange={() => setMethod('card')}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-3 text-base">Tarjeta débito/crédito</span>
              </label>
              {method === 'card' && (
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formattedCard}
                      onChange={handleCardNumberChange}
                      className="w-full border border-gray-300 rounded-2xl p-4 text-lg tracking-widest"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                        className="w-full border border-gray-300 rounded-2xl p-4 text-base"
                      />
                      {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={handleNumericChange(setCardCvv, 4)}
                        maxLength={4}
                        className="w-full border border-gray-300 rounded-2xl p-4 text-base"
                      />
                      {errors.cardCvv && <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>}
                    </div>
                  </div>
                </div>
              )}

              <label className="flex items-center border-b pb-2 pt-4">
                <input
                  type="radio"
                  name="method"
                  value="paypal"
                  checked={method === 'paypal'}
                  onChange={() => setMethod('paypal')}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-3 text-base">PayPal</span>
              </label>
              {method === 'paypal' && (
                <div>
                  <input
                    type="email"
                    placeholder="Email de PayPal"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-2xl p-3 text-base"
                  />
                  {errors.paypalEmail && <p className="text-red-500 text-sm mt-1">{errors.paypalEmail}</p>}
                </div>
              )}

              <label className="flex items-center pt-4">
                <input
                  type="radio"
                  name="method"
                  value="nequi"
                  checked={method === 'nequi'}
                  onChange={() => setMethod('nequi')}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-3 text-base">Nequi</span>
              </label>
              {method === 'nequi' && (
                <div>
                  <input
                    type="text"
                    placeholder="Número de Nequi"
                    value={nequiNumber}
                    onChange={handleNumericChange(setNequiNumber, 10)}
                    className="mt-2 w-full border border-gray-300 rounded-2xl p-3 text-base"
                  />
                  {errors.nequiNumber && <p className="text-red-500 text-sm mt-1">{errors.nequiNumber}</p>}
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-2xl shadow-sm"
            >
              Pagar ahora
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
          <h2 className="text-xl font-semibold mb-10 text-center">RESUMEN DEL PEDIDO</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">VALOR TOTAL</span>
            <span className="text-lg">$ {billing.price}</span>
          </div>
        </div>
      </div>
      <Modal
        showModal={showModal}
        title="Factura pagada"
        btnMessage="Cerrar"
        onClose={() => {
          setShowModal(false);
          navigate(`/dashboard/events/billing-event/${id}`);
        }}
      >
        <p>Factura pagada correctamente.</p>
      </Modal>
    </div>
  );
};

export default PaymentView;