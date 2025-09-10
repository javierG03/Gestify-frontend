import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import foodService from "./services/FoodServices";
import Swal from "sweetalert2"; // Para mostrar alertas de confirmación y errores

const EditFood = () => {
  const navigate = useNavigate();
  const { id: eventId, idFood: foodId } = useParams();  // Recibimos los parámetros de la ruta
  console.log("id del alimento:", foodId, );

  const [foodData, setFoodData] = useState({
    name: "",
    description: "",
    quantity: "",
    unitValue: ""
  });

  const [initialFoodData, setInitialFoodData] = useState({});  // Guardamos los datos iniciales
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar los datos del alimento al iniciar el componente
  useEffect(() => {
    loadFoodData();
  }, [foodId]);

  const loadFoodData = async () => {
    setLoading(true);
    try {
      const response = await foodService.getFood(foodId);
      const food = response.data;

      setFoodData({
        name: food.name || "",
        description: food.description || "",
        quantity: food.quantity_available?.toString() || "",
        unitValue: food.price?.toString() || ""
      });

      setInitialFoodData({
        name: food.name || "",
        description: food.description || "",
        quantity: food.quantity_available?.toString() || "",
        unitValue: food.price?.toString() || ""
      });

    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la información del alimento. Inténtalo de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Manejo de cambios en los inputs
  const handleChange = (name, value) => {
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
    else if (isNaN(Number(foodData.quantity)) || Number(foodData.quantity) < 0)
      newErrors.quantity = "Debe ser un número positivo";

    if (!foodData.unitValue.trim()) newErrors.unitValue = "Campo requerido";
    else if (isNaN(Number(foodData.unitValue)) || Number(foodData.unitValue) < 0)
      newErrors.unitValue = "Debe ser un número positivo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar si hay cambios
  const hasChanges = () => {
    return (
      foodData.name !== initialFoodData.name ||
      foodData.description !== initialFoodData.description ||
      foodData.quantity !== initialFoodData.quantity ||
      foodData.unitValue !== initialFoodData.unitValue
    );
  };

  // Enviar el formulario para actualizar el alimento
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!hasChanges()) {
      Swal.fire("No hay cambios", "No se ha realizado ninguna modificación en los campos.", "info");
      return;
    }

    setLoading(true);
    try {
      const updatedFood = await foodService.updateFood(foodId, {
        name: foodData.name,
        description: foodData.description,
        quantity_available: Number(foodData.quantity),
        price: Number(foodData.unitValue)
      });

      if (!updatedFood) {
        throw new Error("No se pudo actualizar el alimento");
      } else {
        // Redirigir al listado de alimentos
        navigate(`/dashboard/events/detail-events/${eventId}/food-list`);
        Swal.fire("Actualizado", "El alimento ha sido actualizado con éxito.", "success");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el alimento. Inténtalo de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <button
          onClick={() => navigate(`/dashboard/events/detail-events/${eventId}/food-list`)}
          className="flex items-center text-gray-600 hover:text-indigo-600 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Volver
        </button>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Editar Alimento</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <input
              name="name"
              type="text"
              placeholder="Ingrese el nombre del alimento"
              value={foodData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Descripción */}
          <div>
            <textarea
              name="description"
              placeholder="Descripción"
              value={foodData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Cantidad */}
          <div>
            <input
              name="quantity"
              type="number"
              placeholder="Cantidad"
              value={foodData.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
          </div>

          {/* Valor Unitario */}
          <div>
            <input
              name="unitValue"
              type="number"
              placeholder="Valor unitario"
              value={foodData.unitValue}
              onChange={(e) => handleChange("unitValue", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.unitValue && <p className="text-sm text-red-500 mt-1">{errors.unitValue}</p>}
          </div>

          {/* Botón para guardar cambios */}
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

export default EditFood;