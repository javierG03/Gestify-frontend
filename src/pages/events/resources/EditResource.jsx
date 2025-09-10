import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import resourceService from "./services/ResourceService"; // Aquí usamos el resourceService
import Swal from "sweetalert2"; // Importamos SweetAlert2

const EditResource = () => {
  const navigate = useNavigate();
  const { id: eventId, idResource: resourceId } = useParams();  // Recibimos el ID del evento y del recurso de la ruta

  const [resourceData, setResourceData] = useState({
    name: "", 
    description: "", 
    quantity: "", 
    unitValue: "" 
  });
  const [initialResourceData, setInitialResourceData] = useState({});  // Para almacenar los datos iniciales
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar los datos del recurso
  useEffect(() => {
    loadResourceData(); // Cargar los datos del recurso al iniciar el componente
  }, [resourceId]);

  const loadResourceData = async () => {
    setLoading(true);
    try {
      const response = await resourceService.getResource(resourceId); // Usamos el servicio para obtener el recurso
      setResourceData({
        name: response.data.name || "",
        description: response.data.description || "",
        quantity: response.data.quantity_available?.toString() || "",
        unitValue: response.data.price?.toString() || "",
      });

      // Guardamos los datos iniciales para comparar
      setInitialResourceData({
        name: response.data.name || "",
        description: response.data.description || "",
        quantity: response.data.quantity_available?.toString() || "",
        unitValue: response.data.price?.toString() || "",
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la información del recurso. Inténtalo de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResourceData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!resourceData.name.trim()) newErrors.name = "Campo requerido";
    if (!resourceData.quantity.trim()) newErrors.quantity = "Campo requerido";
    if (!resourceData.unitValue.trim()) newErrors.unitValue = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar si hay cambios
  const hasChanges = () => {
    return (
      resourceData.name !== initialResourceData.name ||
      resourceData.description !== initialResourceData.description ||
      resourceData.quantity !== initialResourceData.quantity ||
      resourceData.unitValue !== initialResourceData.unitValue
    );
  };

  // Enviar el formulario para actualizar el recurso
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!hasChanges()) {
      Swal.fire("No hay cambios", "No se ha realizado ninguna modificación en los campos.", "info");
      return;
    }

    setLoading(true);
    try {
      const updatedResource = await resourceService.updateResource(resourceId, {
        name: resourceData.name,
        description: resourceData.description,
        quantity_available: Number(resourceData.quantity),
        price: Number(resourceData.unitValue),
      });

      if (!updatedResource) {
        throw new Error("No se pudo actualizar el recurso");
      } else {
        // Redirige al listado de recursos después de la actualización
        navigate(`/dashboard/events/detail-events/${eventId}/resource-list`);
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el recurso. Inténtalo de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-indigo-600 mb-6">
          <FiArrowLeft className="mr-2" />
          Volver
        </button>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Editar Recurso</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              name="name"
              type="text"
              placeholder="Nombre del recurso"
              value={resourceData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <textarea
              name="description"
              placeholder="Descripción"
              value={resourceData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <input
              name="quantity"
              type="number"
              placeholder="Cantidad"
              value={resourceData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <input
              name="unitValue"
              type="number"
              placeholder="Valor unitario"
              value={resourceData.unitValue}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.unitValue && <p className="text-sm text-red-500 mt-1">{errors.unitValue}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Procesando..." : "GUARDAR CAMBIOS"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditResource;