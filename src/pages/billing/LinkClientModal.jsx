import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../config/AxiosInstance'
import Modal from '../../components/Modal'

/** Genera una contraseña aleatoria de 10 caracteres */
const generateRandomPassword = () => {
  const length = 10
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const LinkClientModal = ({ showModal, onClose, onSuccess }) => {
  // Aquí extraemos el id del evento de la URL
  const { id } = useParams()

  const [clientData, setClientData] = useState({
    name: '',
    last_name: '',
    email: '',
    id_role: 4,
  })
  const [nameError, setNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [linkedUserId, setLinkedUserId] = useState(null)

  if (!showModal) return null

  const handleChange = (field, value) => {
    if (field === 'name' || field === 'last_name') {
      const regex = /^[A-Za-z\s]*$/
      if (!regex.test(value)) {
        field === 'name'
          ? setNameError('Solo se permiten letras y espacios')
          : setLastNameError('Solo se permiten letras y espacios')
        return
      } else {
        field === 'name' ? setNameError('') : setLastNameError('')
      }
    }

    if (field === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Correo inválido')
      } else {
        setEmailError('')
      }
    }

    setClientData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validaciones
    if (!clientData.name.trim()) {
      return window.alert('Por favor ingresa el nombre')
    }
    if (!clientData.last_name.trim()) {
      return window.alert('Por favor ingresa el apellido')
    }
    if (!clientData.email.trim() || !validateEmail(clientData.email)) {
      return window.alert('Por favor ingresa un correo válido')
    }

    setLoading(true)
    setError('')
    let userId = null

    try {
      // 1. Verificar si el usuario existe
      try {
        const userResponse = await axiosInstance.get(`/users/${clientData.email}`)
        const userData = userResponse?.data?.usuario
        if (userData?.id_user) {
          userId = userData.id_user
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // 2. Crear nuevo usuario si no existe
          const randomPassword = generateRandomPassword()

          const response = await axiosInstance.post("/users", {
            name: clientData.name,
            last_name: clientData.last_name,
            email: clientData.email,
            id_role: 3,
            password: randomPassword,
          })

          await axiosInstance.post("/credentials", {
            email: clientData.email,
            password: randomPassword,
          })

          userId = response.data?.usuario?.id_user
          if (!userId) throw new Error("No se pudo crear el usuario")
        } else {
          throw err // Re-lanza otros errores
        }
      }

      // 3. Obtener el price desde /events/prices/:event_id
      const priceRes = await axiosInstance.get(`/events/prices/${id}`)
      const price = priceRes.data.total_value
      if (price == null) {
        throw new Error('No se obtuvo el precio del evento')
      }

      // 4. Vincular usuario al evento enviando todos los campos obligatorios
      await axiosInstance.post('/billing', {
        user_id: userId,
        event_id: id,
        price: price,
      })

      setLinkedUserId(userId)
      setShowSuccessModal(true)
    } catch (err) {
      console.error('Error en LinkClientModal:', err)
      const msg =
        err.response?.data?.message || err.message || 'Error inesperado'
      setError(msg)
      window.alert(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Enlazar Cliente</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-left mb-1">Nombre *</label>
            <input
              type="text"
              value={clientData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              maxLength={20}
              disabled={loading}
              className="w-full border rounded p-2"
            />
            {nameError && (
              <p className="text-red-600 text-sm">{nameError}</p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-left mb-1">Apellido *</label>
            <input
              type="text"
              value={clientData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              maxLength={20}
              disabled={loading}
              className="w-full border rounded p-2"
            />
            {lastNameError && (
              <p className="text-red-600 text-sm">{lastNameError}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-left mb-1">
              Correo electrónico *
            </label>
            <input
              type="email"
              value={clientData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              maxLength={35}
              disabled={loading}
              className="w-full border rounded p-2"
            />
            {emailError && (
              <p className="text-red-600 text-sm">{emailError}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              {loading ? 'Procesando...' : 'Vincular Cliente'}
            </button>
          </div>
        </form>
      </div>
      <Modal
        showModal={showSuccessModal}
        title="Cliente vinculado"
        btnMessage="Cerrar"
        onClose={() => {
          setShowSuccessModal(false)
          // primero notifica al padre para que incorpore al nuevo cliente
          if (linkedUserId !== null) {
            onSuccess(linkedUserId)
          }
          // luego cierra el LinkClientModal
          onClose()
        }}
      >
        <p>Cliente vinculado correctamente.</p>
      </Modal>
    </div>
  )
}

export default LinkClientModal