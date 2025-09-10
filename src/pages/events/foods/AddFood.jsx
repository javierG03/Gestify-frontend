import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import foodService from "./services/FoodServices";

const AddFood = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams(); // Obtener el eventId de la ruta

  const [foodData, setFoodData] = useState({
    name: "",
    description: "",
    quantity: "",
    unitValue: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!foodData.name.trim()) newErrors.name = "Campo requerido";
    if (!foodData.quantity.trim()) newErrors.quantity = "Campo requerido";
    if (!foodData.unitValue.trim()) newErrors.unitValue = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Crear el alimento
      const newFood = await foodService.createFood({
        name: foodData.name,
        description: foodData.description,
        quantity_available: Number(foodData.quantity),
        price: Number(foodData.unitValue),
      });

      const foodId = newFood.data?.id_food || newFood.data?.id;
      console.log(foodId)
      if (!foodId) throw new Error("No se pudo obtener el ID del alimento creado");

      // Asignar alimento al evento
      await foodService.assignFoodToEvent({
        id_event: parseInt(eventId),
        id_food: parseInt(foodId),
      });

      // Resetear el formulario y navegar
      setFoodData({ name: "", description: "", quantity: "", unitValue: "" });
      setErrors({});
      navigate(`/dashboard/events/detail-events/${eventId}/food-list`);
    } catch (err) {
      console.error("Error creando o asignando alimento:", err);
      alert("Ocurrió un error al crear o asignar el alimento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-indigo-600 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Volver
        </button>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Agregar Alimento
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              name="name"
              type="text"
              placeholder="Nombre del alimento"
              value={foodData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <textarea
              name="description"
              placeholder="Descripción"
              value={foodData.description}
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
              value={foodData.quantity}
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
              value={foodData.unitValue}
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
            {loading ? "Procesando..." : "CREAR ALIMENTO"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;