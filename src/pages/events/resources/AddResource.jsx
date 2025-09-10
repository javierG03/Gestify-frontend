import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import resourceService from "./services/ResourceService"

const AddResource = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams(); // Usa "id" si tu ruta es /detail-events/:id/add-resource


  const [resourceData, setResourceData] = useState({
    name: "",
    description: "",
    quantity: "",
    unitValue: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResourceData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!resourceData.name.trim()) newErrors.name = "Campo requerido";
    if (!resourceData.quantity.trim()) newErrors.quantity = "Campo requerido";
    if (!resourceData.unitValue.trim()) newErrors.unitValue = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Crear el recurso
      const newResource = await resourceService.createResource({
        name: resourceData.name,
        description: resourceData.description,
        quantity_available: Number(resourceData.quantity),
        price: Number(resourceData.unitValue),
      });

      const resourceId =
        newResource.data?.id || newResource.data?.id_resource || newResource.data?._id;
      if (!resourceId) throw new Error("No se pudo obtener el ID del recurso creado");

      // Asignar recurso al evento usando POST /event-resources
      await resourceService.assignResourceToEvent({
        id_event: parseInt(eventId),
        id_resource: parseInt(resourceId),
      });

      // Reset form y navegar
      setResourceData({ name: "", description: "", quantity: "", unitValue: "" });
      setErrors({});
      navigate(`/dashboard/events/detail-events/${eventId}/resource-list`); // Ajusta según tu ruta de regreso
    } catch (err) {
      console.error("Error:", err);
      alert("Ocurrió un error al crear o asignar el recurso.");
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

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Agregar Recurso</h1>

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
            {loading ? "Procesando..." : "CREAR RECURSO"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResource;